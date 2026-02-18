from django.db.models import F, Sum, Count, FloatField
from django.db.models.functions import TruncMonth

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets, permissions
from .models import (
    APagar,
    AReceber,
    PlanoDeContas,
    APagar,
    AReceber
)
from .serializers import (
    PlanoDeContasSerializer,
    APagarSerializer,
    AReceberSerializer,
)

# Create your views here.
class PlanoDeContasViewSet(viewsets.ModelViewSet):
    queryset = PlanoDeContas.objects.all().order_by('conta')
    serializer_class = PlanoDeContasSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']


class APagarViewSet(viewsets.ModelViewSet):
    queryset = APagar.objects.all().order_by('datavencimento', 'idcontapagar')
    serializer_class = APagarSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']


class AReceberViewSet(viewsets.ModelViewSet):
    queryset = AReceber.objects.all().order_by('datavencimento', 'descricao')
    serializer_class = AReceberSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

class ContasResumoMensalView(APIView):
    """
    GET /api/contas-resumo/pagar/
    GET /api/contas-resumo/receber/

    Retorna, por mês (datavencimento):
    [
    { "mes": "2026-01", "label": "Jan/2026", "qtd": 5, "total": 1234.56 },
    ]
    """

    def get(self, request, tipo):
        if tipo not in ("pagar", "receber"):
            return Response({"detail": "tipo inválido"}, status=400)

        if tipo == "pagar":
            model = APagar
            pk_field = "idcontapagar"
        else:
            model = AReceber
            pk_field = "idconta"

        qs = (
            model.objects
            .exclude(datavencimento__isnull=True)
            .annotate(
                mes_trunc=TruncMonth("datavencimento"),
                valor_base=F("valorparcela") + F("valorjuros") - F("valordesconto"),
                total_registro=F("valor_base") * F("numeroparcela"),
            )
        )

        agg = (
            qs.values("mes_trunc")
            .annotate(
                qtd=Count(pk_field),
                total=Sum("total_registro", output_field=FloatField()),
            )
            .order_by("mes_trunc")
        )

        data = []
        for row in agg:
            mes = row["mes_trunc"]
            if mes is None:
                continue

            data.append({
                "mes": mes.strftime("%Y-%m"),
                "label": mes.strftime("%b/%Y").capitalize(),
                "qtd": row["qtd"],
                "total": float(row["total"] or 0),
            })

        return Response(data)