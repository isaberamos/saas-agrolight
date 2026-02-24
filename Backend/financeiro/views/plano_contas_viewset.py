from financeiro.models import PlanoDeContas
from financeiro.serializers import PlanoDeContasSerializer
from .base_viewset import BaseFinanceiroViewSet


class PlanoDeContasViewSet(BaseFinanceiroViewSet):

    queryset = PlanoDeContas.objects.all().order_by("conta")

    serializer_class = PlanoDeContasSerializer