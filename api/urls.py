from django.urls import include, path
from .views import MarketList, ProduceList, PriceLogList, SalesRecordList

urlpatterns = []
from .views import latest_prices

urlpatterns += [
    path('latest-prices/', latest_prices),
    path('api/', include('ushauri_backend.urls')),
]


# urlpatterns = [
#     path('markets/', MarketList.as_view(), name='market-list'),
#     path('produce/', ProduceList.as_view(), name='produce-list'),
#     path('pricelogs/', PriceLogList.as_view(), name='pricelog-list'),
#     path('sales/', SalesRecordList.as_view(), name='sales-list'),
# ]
