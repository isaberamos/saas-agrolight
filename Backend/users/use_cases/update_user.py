# users/use_cases/update_user.py
class UpdateUserUseCase:
    def execute(self, user, data):
        password = data.pop('password', None)

        for attr, value in data.items():
            setattr(user, attr, value)

        if password:
            user.set_password(password)

        user.save()
        return user
