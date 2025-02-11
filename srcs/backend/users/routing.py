from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("api/auth/<str:user_id>/", consumers.OnlineUsersConsumer.as_asgi()),
]
