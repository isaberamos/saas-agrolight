# users/api/serializers.py
from rest_framework import serializers
from users.models import Usuario
from users.use_cases.create_user import CreateUserUseCase
from users.use_cases.update_user import UpdateUserUseCase


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email',
            'cpf', 'telefone', 'logradouro', 'numero', 'complemento', 'bairro',
            'cidade', 'estado', 'cep', 'tipousuario', 'password', 'is_active'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'username': {'required': False},
        }

    def create(self, validated_data):
        return CreateUserUseCase().execute(validated_data)

    def update(self, instance, validated_data):
        return UpdateUserUseCase().execute(instance, validated_data)
