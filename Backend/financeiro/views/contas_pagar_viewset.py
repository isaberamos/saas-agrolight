from financeiro.models import APagar
from financeiro.serializers import APagarSerializer
from .base_viewset import BaseFinanceiroViewSet


class APagarViewSet(BaseFinanceiroViewSet):

    queryset = APagar.objects.all().order_by(
        "datavencimento",
        "idcontapagar",
    )

    serializer_class = APagarSerializer