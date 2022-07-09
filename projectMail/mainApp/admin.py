from django.contrib import admin
from .models import Menu, Category, UserComments, UserOrder

# Register your models here.
admin.site.register(Menu)
admin.site.register(Category)
admin.site.register(UserComments)
admin.site.register(UserOrder)