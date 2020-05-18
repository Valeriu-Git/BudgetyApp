from django.forms import  ModelForm
from django.contrib.auth.models import  User
from django import forms
class UserForm(ModelForm):
    class Meta:
        model=User
        fields=('username','password')
        widgets={
        'password':forms.PasswordInput(),
        }
        help_texts={
        'username': None,
        }
