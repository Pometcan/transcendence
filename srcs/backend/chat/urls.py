from django.urls import path
from. import views

urlpatterns = [
    path('create_private_chat/', views.create_private_chat, name='create_private_chat'),
    path('get_room_messages/<str:room_name>/', views.get_room_messages, name='get_room_messages'),
]