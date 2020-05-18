from django.shortcuts import render,redirect
from django.contrib.auth import  authenticate,login as login_user,logout as logout_user
from .forms import  UserForm
from django.contrib.auth.decorators import login_required
from django.contrib import  messages
from .models import  Transaction
from django.contrib import  auth



def index(request):
    return render(request,'index.html');

def registration(request):
    if request.method=='POST':
        form=UserForm(request.POST)
        if form.is_valid():
            user=form.save(commit=False)
            username=form.cleaned_data['username']
            password=form.cleaned_data['password']

            user.set_password(password)
            user.save()
            user=authenticate(username=username,password=password)
            login_user(request,user)
            return redirect(userpage)
    else:
        form=UserForm()
    return render(request,'registration.html',{'form':form})

def userpage(request):
    current_user=auth.get_user(request)
    income_objects=Transaction.objects.filter(user=current_user,tip='income')
    expense_objects=Transaction.objects.filter(user=current_user,tip='expense')
    if request.method=='POST':
        if request.POST.get('post_type') == 'adauga':
            descriere=request.POST.get('description')
            valoare=request.POST.get('valoare')
            tip=request.POST.get('tip')
            Transaction.objects.create(description=descriere,value=valoare,tip=tip,user=current_user)
        elif request.POST.get('post_type') == 'delete':
            descriere=request.POST.get('description')
            valoare=request.POST.get('value')
            tip=request.POST.get('tip')
            delete_objects=Transaction.objects.filter(user=current_user,tip=tip,description=descriere,value=valoare)
            print(delete_objects)
            for objects in delete_objects:
                objects.delete()
                break


    context={'user':current_user,
            'income_objects':income_objects,
            'expense_objects':expense_objects}
    return render(request,'userpage.html',context)

def login(request):
    if request.method=='POST':
        form=UserForm(request.POST)
        username=form.data['username']
        password=form.data['password']
        user=authenticate(request,username=username,password=password)
        if user is not None:
            login_user(request,user)
            return redirect(userpage)

        else:
            messages.error(request,'The user does not exist',)

    else:
        form=UserForm()
    return render(request,'login.html',{'form':form})



@login_required
def logout(request):
    logout_user(request);
    return redirect(index)
