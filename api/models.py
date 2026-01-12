from django.db import models

class Market(models.Model):
    name = models.CharField(max_length=100)  # e.g., Nairobi (Wakulima)
    transport_cost = models.DecimalField(max_digits=10, decimal_places=2)
    market_fee = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Produce(models.Model):
    name = models.CharField(max_length=100)  # e.g., Potatoes
    unit = models.CharField(max_length=20)   # e.g., Kg, 90kg Bag

    def __str__(self):
        return self.name

class PriceLog(models.Model):
    market = models.ForeignKey(Market, on_delete=models.CASCADE, db_index=True)
    produce = models.ForeignKey(Produce, on_delete=models.CASCADE, db_index=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(db_index=True)

    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['date', 'produce']),
            models.Index(fields=['market', 'produce']),
        ]

    def __str__(self):
        return f"{self.produce.name} price at {self.market.name} on {self.date}"

class SalesRecord(models.Model):
    date = models.DateField(db_index=True)
    produce = models.ForeignKey(Produce, on_delete=models.CASCADE, db_index=True)
    volume_sold = models.FloatField()
    market_sold_to = models.ForeignKey(Market, on_delete=models.CASCADE, db_index=True)
    actual_price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"Sale of {self.volume_sold} {self.produce.unit} of {self.produce.name} to {self.market_sold_to.name} on {self.date}"
