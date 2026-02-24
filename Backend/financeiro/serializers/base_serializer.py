from rest_framework import serializers


class ContaFinanceiraSerializerBase(serializers.ModelSerializer):

    valor_total = serializers.ReadOnlyField()
    esta_pago = serializers.ReadOnlyField()
    esta_atrasado = serializers.ReadOnlyField()

    def validate_valorparcela(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "O valor da parcela deve ser maior que zero."
            )
        return value

    def validate_numeroparcela(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "O número de parcelas deve ser maior que zero."
            )
        return value

    def validate(self, data):
        desconto = data.get("valordesconto", 0)
        valor = data.get("valorparcela", 0)

        if desconto > valor:
            raise serializers.ValidationError(
                "O desconto não pode ser maior que o valor da parcela."
            )

        return data