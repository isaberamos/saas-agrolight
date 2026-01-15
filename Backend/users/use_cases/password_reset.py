from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model

User = get_user_model()


class SolicitarRedefinicaoSenha:
    def execute(self, email):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        return {
            "user": user,
            "uid": uid,
            "token": token
        }


class RedefinirSenha:
    def execute(self, uidb64, token, nova_senha):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except Exception:
            return False

        if not default_token_generator.check_token(user, token):
            return False

        user.set_password(nova_senha)
        user.save()
        return True
