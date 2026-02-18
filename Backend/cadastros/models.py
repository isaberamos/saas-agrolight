from django.db import models

# Modelo para campos de endereço (reutilizável)
class EnderecoBase(models.Model):
    logradouro = models.CharField(max_length=255, blank=True, null=True)
    numero = models.CharField(max_length=10, blank=True, null=True)
    complemento = models.CharField(max_length=255, blank=True, null=True)
    bairro = models.CharField(max_length=100, blank=True, null=True)
    cep = models.CharField(max_length=20, blank=True, null=True)
    cidade = models.CharField(max_length=100, blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)

    class Meta:
        abstract = True  # não cria tabela própria

class Cliente(EnderecoBase):
    idcliente = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    cpf_cnpj = models.CharField(max_length=14, unique=True, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'clientes'  

    def __str__(self):
        return self.nome

class Fornecedor(EnderecoBase):
    idfornecedor = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    cpf_cnpj = models.CharField(max_length=14, unique=True, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'fornecedores' 

    def __str__(self):
        return self.nome

class Propriedade(EnderecoBase):
    idpropriedade = models.AutoField(primary_key=True)
    descricao = models.TextField(blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'propriedades'  

    def __str__(self):
        return self.descricao or f"Propriedade {self.idpropriedade}"
