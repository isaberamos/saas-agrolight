from rest_framework.response import Response
from rest_framework import viewsets, permissions
from .models import (
    Cliente,
    Fornecedor,
    Propriedade,
)
from .serializers import (
    ClienteSerializer,
    FornecedorSerializer,
    PropriedadeSerializer
)

class BaseCadastroViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
class ClienteViewSet(BaseCadastroViewSet):
    queryset = Cliente.objects.all().order_by('nome')
    serializer_class = ClienteSerializer

class FornecedorViewSet(BaseCadastroViewSet):
    queryset = Fornecedor.objects.all().order_by('nome')
    serializer_class = FornecedorSerializer

class PropriedadeViewSet(BaseCadastroViewSet):
    queryset = Propriedade.objects.all().order_by('descricao')
    serializer_class = PropriedadeSerializer
