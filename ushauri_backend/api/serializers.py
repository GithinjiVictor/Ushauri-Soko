from rest_framework import serializers
from .models import Market, Produce, PriceLog, SalesRecord

class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = '__all__'

class ProduceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produce
        fields = '__all__'

class PriceLogSerializer(serializers.ModelSerializer):
    market = MarketSerializer(read_only=True)
    produce = ProduceSerializer(read_only=True)

    class Meta:
        model = PriceLog
        fields = '__all__'

class SalesRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRecord
        fields = '__all__'
