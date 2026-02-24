from financeiro.models import AReceber
from financeiro.serializers import AReceberSerializer
from .base_viewset import BaseFinanceiroViewSet


class AReceberViewSet(BaseFinanceiroViewSet):

    queryset = AReceber.objects.all().order_by(
        "datavencimento",
        "descricao",
    )

    serializer_class = AReceberSerializer