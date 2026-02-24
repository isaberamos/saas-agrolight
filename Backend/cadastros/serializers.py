from rest_framework import serializers
from .models import (
    Cliente,
    Fornecedor,
    Propriedade
)

class BaseCadastroSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        
class ClienteSerializer(BaseCadastroSerializer):
    class Meta(BaseCadastroSerializer.Meta):
        model = Cliente
        read_only_fields = ['idcliente']

class FornecedorSerializer(BaseCadastroSerializer):
    class Meta(BaseCadastroSerializer.Meta):
        model = Fornecedor
        read_only_fields = ['idfornecedor']
        
class PropriedadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propriedade
        fields = '__all__'
        read_only_fields = ['idpropriedade']