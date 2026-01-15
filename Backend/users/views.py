from users.use_cases.change_user_status import ChangeUserStatusUseCase
from users.use_cases.password_reset import SolicitarRedefinicaoSenha, RedefinirSenha
from users.services.email_service import enviar_email_redefinicao

from .models import Usuario
from .serializers import UsuarioSerializer

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['put'])
    def inativar(self, request, pk=None):
        usuario = self.get_object()
        ChangeUserStatusUseCase().inativar(usuario)
        return Response({'status': 'Usuário inativado'})

    @action(detail=True, methods=['put'])
    def ativar(self, request, pk=None):
        usuario = self.get_object()
        ChangeUserStatusUseCase().ativar(usuario)
        return Response({'status': 'Usuário ativado'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def usuario_logado(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "tipousuario": user.tipousuario,
        "first_name": user.first_name,
        "last_name": user.last_name,
    })


@csrf_exempt
def solicitar_redefinicao(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    data = json.loads(request.body)
    email = data.get("email")

    use_case = SolicitarRedefinicaoSenha()
    result = use_case.execute(email)

    if not result:
        return JsonResponse({'error': 'Usuário não encontrado'}, status=404)

    link = f"http://localhost:3000/redefinir-senha/{result['uid']}/{result['token']}/"
    enviar_email_redefinicao(email, link)

    return JsonResponse({'message': 'E-mail enviado com instruções'})


@csrf_exempt
def redefinir_senha(request, uidb64, token):
    if request.method != "POST":
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    data = json.loads(request.body)
    nova_senha = data.get("senha")

    use_case = RedefinirSenha()
    sucesso = use_case.execute(uidb64, token, nova_senha)

    if not sucesso:
        return JsonResponse({'error': 'Token inválido ou expirado'}, status=400)

    return JsonResponse({'message': 'Senha redefinida com sucesso'})
