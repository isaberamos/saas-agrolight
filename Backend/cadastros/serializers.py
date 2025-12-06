from rest_framework import serializers
from .models import (
    APagar,
    AReceber,
    Cliente,
    Fornecedor,
    Propriedade,
    PlanoDeContas,
    APagar,
    AReceber
)

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
        read_only_fields = ['idcliente']

class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = '__all__'
        read_only_fields = ['idfornecedor']

class PropriedadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propriedade
        fields = '__all__'
        read_only_fields = ['idpropriedade']

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