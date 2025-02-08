from django.urls import path , include
from chat.consumers import ChatConsumer

# Here, "" is routing to the URL ChatConsumer which 
# will handle the chat functionality.
websocket_urlpatterns = [
    path("chat/<str:room_name>/", ChatConsumer.as_asgi()), 
] 
