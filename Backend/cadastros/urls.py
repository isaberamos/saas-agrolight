from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClienteViewSet,
    FornecedorViewSet,
    PropriedadeViewSet,
    PlanoDeContasViewSet,
    APagarViewSet,
    AReceberViewSet,
)

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'fornecedores', FornecedorViewSet, basename='fornecedor')
router.register(r'propriedades', PropriedadeViewSet, basename='propriedade')
router.register(r'plano-contas', PlanoDeContasViewSet, basename='plano-contas')
router.register(r'contas-pagar', APagarViewSet, basename='conta-pagar')
router.register(r'contas-receber', AReceberViewSet, basename='conta-receber')

urlpatterns = [
    path('', include(router.urls)),
]