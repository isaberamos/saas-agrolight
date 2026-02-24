from rest_framework import viewsets, permissions


class BaseFinanceiroViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]