from django.core.mail import send_mail

def enviar_email_redefinicao(email, link):
    send_mail(
        'Redefinição de senha',
        f'Clique no link para redefinir sua senha: {link}',
        'seu_email@dominio.com',
        [email],
        fail_silently=False,
    )
