# users/use_cases/change_user_status.py
class ChangeUserStatusUseCase:
    def inativar(self, user):
        user.is_active = False
        user.save()

    def ativar(self, user):
        user.is_active = True
        user.save()
