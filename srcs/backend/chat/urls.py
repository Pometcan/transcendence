from django.urls import path, include
from chat import views as chat_views
from django.contrib.auth.views import LogoutView, LoginView

urlpatterns = [
    path("chat/<str:username>/", chat_views.chatRoom, name="chat_room"),
    path('users_list/', chat_views.userList, name='user_list'),
]