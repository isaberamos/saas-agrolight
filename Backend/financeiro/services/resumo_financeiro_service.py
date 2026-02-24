from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth

from financeiro.models import APagar, AReceber


class ResumoFinanceiroService:

    MODEL_MAP = {
        "pagar": (APagar, "idcontapagar"),
        "receber": (AReceber, "idconta"),
    }

    @classmethod
    def resumo_mensal(cls, tipo: str):

        try:
            model, pk_field = cls.MODEL_MAP[tipo]
        except KeyError:
            raise ValueError("Tipo inválido")

        qs = (
            model.objects
            .exclude(datavencimento__isnull=True)
            .annotate(
                mes=TruncMonth("datavencimento"),
                total=model.valor_total_expression(),
            )
        )

        agg = (
            qs.values("mes")
            .annotate(
                qtd=Count(pk_field),
                total=Sum("total"),
            )
            .order_by("mes")
        )

        return [
            {
                "mes": row["mes"],
                "qtd": row["qtd"],
                "total": float(row["total"] or 0),
            }
            for row in agg
            if row["mes"]
        ]