from django.contrib import admin
from django.contrib.auth.models import User
from .models import  Transaction
# Register your models here.

admin.site.register(Transaction)
