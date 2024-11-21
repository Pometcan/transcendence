from django.urls import path
from .views import User_database

urlpatterns = [
    path("", User_database, name='freeze_users'),
]
