from django.db import models
import cadastros.models

class PlanoDeContas(models.Model):
    idplanocontas   = models.AutoField(primary_key=True)
    descricao       = models.CharField(max_length=30, blank=True, null=True)
    tipofluxocaixa  = models.SmallIntegerField(blank=True, null=True)
    conta           = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed  = False
        db_table = 'plano_de_contas'

class APagar(models.Model):
    idcontapagar = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=30)
    valorparcela = models.DecimalField(max_digits=15, decimal_places=2)
    numeroparcela = models.IntegerField()
    datavencimento = models.DateField()
    dataquitacao = models.DateField(null=True, blank=True)
    valordesconto = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    valorjuros = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # relacionamentos – repara nas ASPAS
    idpropriedade = models.ForeignKey(
        'cadastros.Propriedade',
        on_delete=models.PROTECT,
        db_column='idpropriedade',
        null=True,
        blank=True,
        related_name='contas_pagar',
    )
    idfornecedor = models.ForeignKey(
        'cadastros.Fornecedor',
        on_delete=models.PROTECT,
        db_column='idfornecedor',
        null=True,
        blank=True,
        related_name='contas_pagar',
    )
    idplanocontas = models.ForeignKey(
        'PlanoDeContas',
        on_delete=models.PROTECT,
        db_column='idplanocontas',
        null=True,
        blank=True,
        related_name='contas_pagar',
    )

    class Meta:
        managed = False      
        db_table = 'a_pagar'


class AReceber(models.Model):
    idconta = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=30)
    valorparcela = models.DecimalField(max_digits=15, decimal_places=2)
    numeroparcela = models.IntegerField()
    datavencimento = models.DateField()
    dataquitacao = models.DateField(null=True, blank=True)
    valordesconto = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    valorjuros = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    idpropriedade = models.ForeignKey(
        'cadastros.Propriedade',
        on_delete=models.PROTECT,
        db_column='idpropriedade',
        null=True,
        blank=True,
        related_name='contas_receber',
    )
    idcliente = models.ForeignKey(
        'cadastros.Cliente',
        on_delete=models.PROTECT,
        db_column='idcliente',
        null=True,
        blank=True,
        related_name='contas_receber',
    )
    idplanocontas = models.ForeignKey(
        'PlanoDeContas',
        on_delete=models.PROTECT,
        db_column='idplanocontas',
        null=True,
        blank=True,
        related_name='contas_receber',
    )

    class Meta:
        managed = False
        db_table = 'a_receber'
        
        