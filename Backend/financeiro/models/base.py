from django.db import models
from django.db.models import F, ExpressionWrapper, DecimalField


class ContaFinanceiraBase(models.Model):
    descricao = models.CharField(max_length=30)

    valorparcela = models.DecimalField(
        max_digits=15,
        decimal_places=2,
    )

    numeroparcela = models.IntegerField()

    datavencimento = models.DateField()

    dataquitacao = models.DateField(
        null=True,
        blank=True,
    )

    valordesconto = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
    )

    valorjuros = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
    )

    propriedade = models.ForeignKey(
        "cadastros.Propriedade",
        on_delete=models.PROTECT,
        db_column="idpropriedade",
        null=True,
        blank=True,
        related_name="%(class)s_propriedades",
    )

    plano_contas = models.ForeignKey(
        "financeiro.PlanoDeContas",
        on_delete=models.PROTECT,
        db_column="idplanocontas",
        null=True,
        blank=True,
        related_name="%(class)s_planos",
    )

    @classmethod
    def valor_total_expression(cls):
        return ExpressionWrapper(
            (
                F("valorparcela")
                + F("valorjuros")
                - F("valordesconto")
            ) * F("numeroparcela"),
            output_field=DecimalField(
                max_digits=15,
                decimal_places=2,
            ),
        )

    @property
    def valor_total(self):
        return (
            (self.valorparcela + self.valorjuros - self.valordesconto)
            * self.numeroparcela
        )

    class Meta:
        abstract = True
        
    @property
    def esta_pago(self):
        return self.dataquitacao is not None
    
    @property
    def esta_atrasado(self):
        from django.utils.timezone import now
        return (
            not self.esta_pago
            and self.datavencimento < now().date()
        )