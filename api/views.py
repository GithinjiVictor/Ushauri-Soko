from rest_framework import viewsets
from django.db.models import Max, Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Market, Produce, PriceLog, SalesRecord
from .serializers import (
    MarketSerializer,
    ProduceSerializer,
    PriceLogSerializer,
    SalesRecordSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import timedelta
from django.utils import timezone

# --- FUNCTION BASED VIEW (Kept as requested) ---
@api_view(['GET'])
def latest_prices(request):
    data = []
    markets = PriceLog.objects.values(
        'market__name',
        'produce__name'
    ).annotate(
         latest_price=Max('price')
    )

    for item in markets:
        data.append({
            'market': item['market__name'],
            'produce': item['produce__name'],
            'price': item['latest_price']
        })

    return Response(data)

# --- STANDARD VIEWSETS ---

from .permissions import IsAdminOrReadOnly

# --- STANDARD VIEWSETS ---

class MarketViewSet(viewsets.ModelViewSet):
    queryset = Market.objects.all()
    serializer_class = MarketSerializer
    permission_classes = [IsAdminOrReadOnly]

class ProduceViewSet(viewsets.ModelViewSet):
    queryset = Produce.objects.all()
    serializer_class = ProduceSerializer
    permission_classes = [IsAdminOrReadOnly]

class PriceLogViewSet(viewsets.ModelViewSet):
    queryset = PriceLog.objects.all().order_by('-date')
    serializer_class = PriceLogSerializer
    permission_classes = [IsAdminOrReadOnly]

class SalesRecordViewSet(viewsets.ModelViewSet):
    queryset = SalesRecord.objects.all().order_by('-date')
    serializer_class = SalesRecordSerializer
    permission_classes = [IsAuthenticated]

# --- NEW PREDICTION ENGINE (Simple Moving Average) ---
class PriceForecastViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated] 

    def list(self, request):
        forecasts = []
        markets = Market.objects.all()
        produces = Produce.objects.all()

        for produce in produces:
            for market in markets:
                # 1. Fetch the last 7 days of data (The "Moving" part)
                recent_logs = PriceLog.objects.filter(
                    market=market,
                    produce=produce
                ).order_by('-date')[:7]

                if recent_logs.exists():
                    # 2. Calculate the Average (The "Average" part)
                    # SMA Formula: Sum of prices / Count of prices
                    total_price = sum(log.price for log in recent_logs)
                    avg_price = total_price / len(recent_logs)
                    
                    # 3. Predict for the next available day (Tomorrow relative to last log)
                    last_log_date = recent_logs[0].date
                    predicted_date = last_log_date + timedelta(days=1)

                    forecasts.append({
                        'market': market.name,
                        'produce': produce.name,
                        'predicted_price': round(avg_price, 2),
                        'date': predicted_date,
                        'type': 'forecast'
                    })
        
        return Response(forecasts)

# --- FIXED VIEWSET (Renamed from LatestPricesView) ---
class LatestPricesViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    """
    A ViewSet for listing the latest prices.
    Inherits from viewsets.ViewSet to work with router or as_view({'get': 'list'}).
    """
    def list(self, request):
        # Get latest date per (market, produce)
        latest_dates = (
            PriceLog.objects
            .values('market', 'produce')
            .annotate(latest_date=Max('date'))
        )

        # Build query filter for all latest (market, produce, date) tuples
        query = Q()
        if latest_dates:
            for entry in latest_dates:
                query |= Q(
                    market_id=entry['market'],
                    produce_id=entry['produce'],
                    date=entry['latest_date']
                )
            latest_price_logs = PriceLog.objects.filter(query).select_related('market', 'produce')
        else:
            latest_price_logs = PriceLog.objects.none()

        serializer = PriceLogSerializer(latest_price_logs, many=True)
        return Response(serializer.data)
    

    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class BacktestViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Runs a Retrospective Financial Backtest.
        Compares 'Baseline Strategy' (Selling to cheapest transport market)
        vs 'Algorithmic Strategy' (Selling to highest net profit market).
        """
        volume = 1000  # Standardize test on 1 ton (1000kg)
        
        # 1. Identify the "Baseline" Market (Lowest Transport Cost = "Local")
        try:
            baseline_market = Market.objects.order_by('transport_cost').first()
        except Market.DoesNotExist:
            return Response({"error": "No markets found"}, status=400)

        # 2. Get all dates with price data
        dates = PriceLog.objects.dates('date', 'day').distinct()
        produces = Produce.objects.all()
        
        results = []
        cumulative_human = 0
        cumulative_ai = 0
        
        # 3. Replay History
        for date in dates:
            daily_human_profit = 0
            daily_ai_profit = 0
            
            for produce in produces:
                # Get all prices for this produce on this day
                logs = PriceLog.objects.filter(date=date, produce=produce)
                
                if not logs.exists():
                    continue

                # --- STRATEGY A: HUMAN (Baseline) ---
                # The human sells to the nearest market (lowest transport)
                human_log = logs.filter(market=baseline_market).first()
                if human_log:
                    cost = baseline_market.transport_cost + baseline_market.market_fee
                    revenue = human_log.price * volume
                    daily_human_profit += (revenue - cost)
                
                # --- STRATEGY B: AI (Optimization) ---
                # The algorithm checks ALL markets and picks the best one
                best_option_profit = -1000000 # Start low
                
                for log in logs:
                    market = log.market
                    cost = market.transport_cost + market.market_fee
                    revenue = log.price * volume
                    net_profit = revenue - cost
                    
                    if net_profit > best_option_profit:
                        best_option_profit = net_profit
                
                if best_option_profit > -1000000:
                    daily_ai_profit += best_option_profit

            # Update running totals
            cumulative_human += daily_human_profit
            cumulative_ai += daily_ai_profit
            
            results.append({
                "date": date,
                "human_total": cumulative_human,
                "ai_total": cumulative_ai,
                "uplift": cumulative_ai - cumulative_human
            })
            
        # 4. Calculate Final Metrics
        uplift_percentage = 0
        if cumulative_human > 0:
            uplift_percentage = ((cumulative_ai - cumulative_human) / cumulative_human) * 100
            
        return Response({
            "timeline": results,
            "summary": {
                "human_final": cumulative_human,
                "ai_final": cumulative_ai,
                "uplift_cash": cumulative_ai - cumulative_human,
                "uplift_percent": round(uplift_percentage, 1)
            }
        })