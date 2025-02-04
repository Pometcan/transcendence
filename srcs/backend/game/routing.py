from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("api/pong/<str:room_id>/<str:user_id>", consumers.GameConsumer.as_asgi()),
]
