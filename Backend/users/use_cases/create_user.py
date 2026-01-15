# users/use_cases/create_user.py
from users.models import Usuario

class CreateUserUseCase:
    def execute(self, data):
        password = data.pop('password', None)

        user = Usuario(**data)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save()
        return user
