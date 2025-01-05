from django.db import models
from django.contrib.auth.models import UserManager

class User(models.Model):
    #id # 1'er 1'er otomatik artmalı // not null
    name = models.CharField(max_length=100) #not null
    surname = models.CharField(max_length=100) #not null
    email = models.EmailField(max_length=100, unique=True) #mail formatı valid mi kontrol et && !!!uniq olmalı & not null
    password = models.CharField(max_length=3) #şifre vaidasyonları ekle && hashle & not null & min limit
    username = models.CharField(max_length=100, unique=True, null=False) #uniq olmalı & not null
    avatar = models.URLField(max_length=500) #resim linki tutulacak 

    create_date = models.DateTimeField(auto_now_add=True) #not null
    update_date = models.DateTimeField(auto_now=True) #

    def __str__(self):
        return self.username