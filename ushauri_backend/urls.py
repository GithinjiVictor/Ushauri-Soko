from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.http import HttpResponse

# Import JWT Views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from api.views import (
    MarketViewSet, 
    ProduceViewSet, 
    PriceLogViewSet, 
    SalesRecordViewSet, 
    LatestPricesViewSet,
     PriceForecastViewSet,
     BacktestViewSet,
     UserViewSet,
     CustomTokenObtainPairView
)

router = routers.DefaultRouter()
router.register(r'markets', MarketViewSet)
router.register(r'produce', ProduceViewSet)
router.register(r'pricelogs', PriceLogViewSet)
router.register(r'salesrecords', SalesRecordViewSet, basename='salesrecord')
router.register(r'forecasts', PriceForecastViewSet, basename='priceforecast')
router.register(r'backtest', BacktestViewSet, basename='backtest')
router.register(r'users', UserViewSet)

def home(request):
    return HttpResponse("Welcome to Ushauri Soko API")

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # --- NEW AUTHENTICATION ENDPOINTS ---
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Refresh Session
    
    path('api/latest-prices/', LatestPricesViewSet.as_view({'get': 'list'}), name='latest-prices'),
]