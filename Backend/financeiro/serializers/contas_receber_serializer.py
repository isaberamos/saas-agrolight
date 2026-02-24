from ..models import AReceber
from .base_serializer import ContaFinanceiraSerializerBase


class AReceberSerializer(ContaFinanceiraSerializerBase):

    class Meta:
        model = AReceber
        fields = [
            "idconta",
            "descricao",
            "valorparcela",
            "numeroparcela",
            "datavencimento",
            "dataquitacao",
            "valordesconto",
            "valorjuros",
            "propriedade",
            "cliente",
            "plano_contas",
            "valor_total",
            "esta_pago",
            "esta_atrasado",
        ]
