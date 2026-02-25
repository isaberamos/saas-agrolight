from django.db import models
from .base import ContaFinanceiraBase


class APagar(ContaFinanceiraBase):
    idcontapagar = models.AutoField(primary_key=True)

    fornecedor = models.ForeignKey(
        "cadastros.Fornecedor",
        on_delete=models.PROTECT,
        db_column="idfornecedor",
        related_name="contas_pagar",
    )

    class Meta:
        managed = False
        db_table = "a_pagar"