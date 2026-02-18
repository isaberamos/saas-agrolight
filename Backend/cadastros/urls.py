from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClienteViewSet,
    FornecedorViewSet,
    PropriedadeViewSet
)

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'fornecedores', FornecedorViewSet, basename='fornecedor')
router.register(r'propriedades', PropriedadeViewSet, basename='propriedade')

urlpatterns = [
    path('', include(router.urls)),
]