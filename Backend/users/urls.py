from django.urls import path, include
from users.views import (
    usuario_logado,
    solicitar_redefinicao,
    redefinir_senha,
    UsuarioViewSet
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')

urlpatterns = [
    path('api/usuario-logado/', usuario_logado, name='usuario_logado'),

    path('api/solicitar-redefinicao/', solicitar_redefinicao, name='solicitar_redefinicao'),
    path('api/redefinir-senha/<str:uidb64>/<str:token>/', redefinir_senha, name='redefinir_senha'),

    path('', include(router.urls)),
]
