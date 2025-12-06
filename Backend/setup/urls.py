from django.contrib import admin
from django.urls import path, include
from cadastros.views import ContasResumoMensalView
from setup import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),


    # Usuários (templates e views HTML)
    path('', include('users.urls')),

    # API Users
    path('api/', include(('users.api_urls', 'users'), namespace='users_api')),

    # API Cadastros (Clientes, Fornecedores, Plano de Contas etc.)
    path('api/', include('cadastros.urls')),
    

    # JWT Auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # endpoint extra de resumo
    path(
        'api/contas-resumo/<str:tipo>/',
        ContasResumoMensalView.as_view(),
        name='contas-resumo-mensal',
    ),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
