from .models import APagar, AReceber, PlanoDeContas
from rest_framework import serializers

class PlanoDeContasSerializer(serializers.ModelSerializer):
    """
    Usa diretamente as colunas da tabela plano_de_contas:
    - idplanocontas (PK)
    - conta         (código: 1, 1.1, 1.1.1.1...)
    - descricao
    - tipofluxocaixa (vamos usar 1 = Débito, 2 = Crédito)
    """

    class Meta:
        model = PlanoDeContas
        fields = [
            'idplanocontas',
            'conta',
            'descricao',
            'tipofluxocaixa',
        ]

    def validate_conta(self, value):
        if not value:
            raise serializers.ValidationError("O código da conta é obrigatório.")
        return value

class APagarSerializer(serializers.ModelSerializer):
    class Meta:
        model = APagar
        fields = [
            'idcontapagar',
            'descricao',
            'valorparcela',
            'numeroparcela',
            'datavencimento',
            'dataquitacao',
            'valordesconto',
            'valorjuros',
            'idpropriedade',
            'idfornecedor',
            'idplanocontas',
        ]

class AReceberSerializer(serializers.ModelSerializer):
    class Meta:
        model = AReceber
        fields = '__all__'