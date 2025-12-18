from django.contrib import admin
from .models import Market, Produce, PriceLog, SalesRecord

admin.site.register(Market)
admin.site.register(Produce)
admin.site.register(PriceLog)
admin.site.register(SalesRecord)
