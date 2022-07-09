from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator

# Create your models here.
class Menu(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=300,blank=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    imgPath = models.URLField(blank=True)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        output = {
            "name": self.name,
            "price": self.price,
            "imgPath": self.imgPath,
            "category": self.category,
            "description": self.description
        }
        return str(output)

class Category(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200,blank=True)
    imgPath = models.URLField(blank=True)

    def __str__(self):
        return f'{self.name}'

class UserComments(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    item = models.ForeignKey('Menu', on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.CharField(max_length=500)
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        output = {
            "user": self.user,
            "item": self.item,
            "comment": self.comment,
            "rating": self.rating,
            "time": self.time
        }
        return str(output)

class UserOrder(models.Model):
    items = models.JSONField(default=[
        {
            "item": "",
            "price": 0,
            "quantity": 0
        }
    ], validators=[MinLengthValidator(10)])
    grandTotal = models.DecimalField(max_digits=9, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    timeOfOrder = models.DateTimeField(auto_now_add=True)
    ORDER_STATUS = (
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
        ('Pending', 'Pending'),
    )
    status = models.CharField(max_length=15, choices=ORDER_STATUS, default='Completed', blank=True)

    def __str__(self):
        return f'{self.user} - {self.items} at {self.timeOfOrder}'


