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

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all().order_by('nome')
    serializer_class = ClienteSerializer
    permission_classes = [permissions.IsAuthenticated]

class FornecedorViewSet(viewsets.ModelViewSet):
    queryset = Fornecedor.objects.all().order_by('nome')
    serializer_class = FornecedorSerializer
    permission_classes = [permissions.IsAuthenticated]

class PropriedadeViewSet(viewsets.ModelViewSet):
    queryset = Propriedade.objects.all().order_by('descricao')
    serializer_class = PropriedadeSerializer
    permission_classes = [permissions.IsAuthenticated]
