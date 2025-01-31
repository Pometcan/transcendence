from django.urls import path
from . import views

urlpatterns = [
    path('host/', views.host_game, name='host'),
    path('join/', views.join_game, name='join'),
]
