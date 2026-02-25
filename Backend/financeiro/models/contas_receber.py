from django.db import models
from .base import ContaFinanceiraBase


class AReceber(ContaFinanceiraBase):
    idconta = models.AutoField(primary_key=True)

    cliente = models.ForeignKey(
        "cadastros.Cliente",
        on_delete=models.PROTECT,
        db_column="idcliente",
        related_name="contas_receber",
    )

    class Meta:
        managed = False
        db_table = "a_receber"