from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    description=models.CharField(max_length=20)
    value=models.PositiveIntegerField()
    tip=models.CharField(max_length=10)
    user=models.ForeignKey(User,on_delete=models.CASCADE)

    def __str__(self):
        return self.description
