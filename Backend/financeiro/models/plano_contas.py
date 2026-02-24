from django.db import models


class PlanoDeContas(models.Model):
    idplanocontas = models.AutoField(primary_key=True)

    descricao = models.CharField(
        max_length=30,
        blank=True,
        null=True,
    )

    tipofluxocaixa = models.SmallIntegerField(
        blank=True,
        null=True,
    )

    conta = models.CharField(
        max_length=15,
        blank=True,
        null=True,
    )

    class Meta:
        managed = False
        db_table = "plano_de_contas"
        ordering = ["conta"]

    def __str__(self):
        return f"{self.conta} - {self.descricao}"