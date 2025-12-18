from rest_framework import serializers
from .models import Market, Produce, PriceLog, SalesRecord

class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = "__all__"

class ProduceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produce
        fields = "__all__"

class PriceLogSerializer(serializers.ModelSerializer):
    market_name = serializers.CharField(source='market.name', read_only=True)
    produce_name = serializers.CharField(source='produce.name', read_only=True)

    class Meta:
        model = PriceLog
        fields = ['id', 'price', 'date', 'market', 'market_name', 'produce', 'produce_name']

class SalesRecordSerializer(serializers.ModelSerializer):
    # FIXED: Renamed 'market' to 'market_sold_to' to match your models.py
    market_sold_to = serializers.SlugRelatedField(
        slug_field='name', 
        queryset=Market.objects.all()
    )
    
    # 'produce' matches models.py, so this is fine
    produce = serializers.SlugRelatedField(
        slug_field='name', 
        queryset=Produce.objects.all()
    )

    class Meta:
        model = SalesRecord
        fields = '__all__'