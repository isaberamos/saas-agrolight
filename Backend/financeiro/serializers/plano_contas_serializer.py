from rest_framework import serializers
from ..models import PlanoDeContas


class PlanoDeContasSerializer(serializers.ModelSerializer):

    class Meta:
        model = PlanoDeContas
        fields = [
            "idplanocontas",
            "conta",
            "descricao",
            "tipofluxocaixa",
        ]

    def validate_conta(self, value):
        if not value:
            raise serializers.ValidationError(
                "O código da conta é obrigatório."
            )
        return value