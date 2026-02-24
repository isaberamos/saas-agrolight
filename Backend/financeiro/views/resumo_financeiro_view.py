from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from financeiro.services.resumo_financeiro_service import (
    ResumoFinanceiroService
)


class ContasResumoMensalView(APIView):

    def get(self, request, tipo):

        try:
            data = ResumoFinanceiroService.resumo_mensal(tipo)
            return Response(data)

        except ValueError:
            return Response(
                {"detail": "Tipo inválido"},
                status=status.HTTP_400_BAD_REQUEST,
            )