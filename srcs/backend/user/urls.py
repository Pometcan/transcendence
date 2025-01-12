from django.urls import path

from . import views
from .views import AddUserView, GetUserByIdView, GetAllUsersView, UpdateUserView, DeactivateUserView

urlpatterns = [
    path("", views.index, name="index"),
    path('register/', AddUserView, name='add_user'),
    path('profile/<int:id>/', GetUserByIdView, name='get_user'),
    path('allUsers/', GetAllUsersView, name='get_all_users'),
    path('updateProfile/', UpdateUserView, name='update_user'),
    path('deleteAccount/', DeactivateUserView, name='delete_user'),
]