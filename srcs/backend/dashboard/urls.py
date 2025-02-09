# dashboard/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('api/general/', views.general_stats_api, name='general_stats_api'),
    path('api/test12/', views.test_api, name='test_api'),
]