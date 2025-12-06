from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login
from users.forms import LoginForms, RegisterForms
from django.contrib.auth.hashers import make_password
from .models import Usuario
from .serializers import UsuarioSerializer
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import get_user_model, authenticate
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


# ViewSet para CRUD de Usuario via API
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]  

    @action(detail=True, methods=['put'])
    def inativar(self, request, pk=None):
        try:
            usuario = self.get_object()
            usuario.is_active = False
            usuario.save()
            return Response({'status': 'Usuário inativado'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=True, methods=['put'])
    def ativar(self, request, pk=None):
        try:
            usuario = self.get_object()
            usuario.is_active = True
            usuario.save()
            return Response({'status': 'Usuário ativado'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def api_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'error': 'Credenciais inválidas'}, status=401)

    return JsonResponse({
        'message': 'Login realizado com sucesso',
        'user_id': user.id,
        'username': user.username,
        'tipousuario': user.tipousuario,
    })


def login_view(request):
    form = LoginForms()

    if request.method == 'POST':
        form = LoginForms(request.POST)

        if form.is_valid():
            username = form.cleaned_data['username']
            senha = form.cleaned_data['senha']

            user = authenticate(request, username=username, password=senha)

            if user is not None:
                auth_login(request, user)
                return redirect('index')  # Ajuste para a url inicial

        return redirect('login_view')

    return render(request, 'users/login.html', {"form": form})


def register(request):
    form = RegisterForms()

    if request.method == 'POST':
        form = RegisterForms(request.POST)

        if form.is_valid():
            if form.cleaned_data["senha_1"] != form.cleaned_data["senha_2"]:
                return redirect('register')

            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            senha = form.cleaned_data['senha_1']

            if Usuario.objects.filter(username=username).exists():
                return redirect('register')

            user = Usuario(
                username=username,
                email=email
            )
            user.set_password(senha)
            user.save()

            return redirect('login_view')

    return render(request, 'users/register.html', {"form": form})


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
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")

        try:
            user = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuário não encontrado.'}, status=404)

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        link = f"http://localhost:3000/redefinir-senha/{uid}/{token}/"

        # Enviar o e-mail
        send_mail(
            'Redefinição de senha',
            f'Clique no link para redefinir sua senha: {link}',
            'seu_email@dominio.com',
            [email],
            fail_silently=False,
        )

        return JsonResponse({'message': 'E-mail enviado com instruções.'})


@csrf_exempt
def redefinir_senha(request, uidb64, token):
    if request.method == "POST":
        data = json.loads(request.body)
        nova_senha = data.get("senha")

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = get_user_model().objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return JsonResponse({'error': 'Usuário inválido.'}, status=400)

        if default_token_generator.check_token(user, token):
            user.set_password(nova_senha)
            user.save()
            return JsonResponse({'message': 'Senha redefinida com sucesso!'})
        else:
            return JsonResponse({'error': 'Token inválido ou expirado.'}, status=400)
