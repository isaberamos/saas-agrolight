from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlanoDeContasViewSet,
    APagarViewSet,
    AReceberViewSet,
)

router = DefaultRouter()
router.register(r'plano-contas', PlanoDeContasViewSet, basename='plano-contas')
router.register(r'contas-pagar', APagarViewSet, basename='conta-pagar')
router.register(r'contas-receber', AReceberViewSet, basename='conta-receber')

urlpatterns = [
    path('', include(router.urls)),
]