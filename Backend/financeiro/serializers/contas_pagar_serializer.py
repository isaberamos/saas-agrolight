from ..models import APagar
from .base_serializer import ContaFinanceiraSerializerBase


class APagarSerializer(ContaFinanceiraSerializerBase):

    class Meta:
        model = APagar
        fields = [
            "idcontapagar",
            "descricao",
            "valorparcela",
            "numeroparcela",
            "datavencimento",
            "dataquitacao",
            "valordesconto",
            "valorjuros",
            "propriedade",
            "fornecedor",
            "plano_contas",
            "valor_total",
            "esta_pago",
            "esta_atrasado",
        ]
