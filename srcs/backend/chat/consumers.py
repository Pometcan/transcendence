import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from.models import ChatMessage, ChatRoom
from users.serializers import UserBasicInfoSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def create_chat(self, room_name, message, user):
        return ChatMessage.objects.create(room_name=room_name, message=message, user=user)

    async def connect(self):
        self.user = self.scope['user'] 
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name, 
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        room = await self.get_room_instance(self.room_name)
        await self.create_chat(room, message, self.user)

        user_serializer = UserBasicInfoSerializer(self.user) 

        await self.channel_layer.group_send(
            self.room_group_name, {
                "type": "sendMessage",
                "message": message,
                "user": user_serializer.data
            }
        )

    async def sendMessage(self, event):
        message = event["message"]
        user_data = event["user"]

        await self.send(text_data=json.dumps({
            "message": message,
            "user": user_data
        }))

    @database_sync_to_async
    def get_room_instance(self, room_name):
        return ChatRoom.objects.get(room_name=room_name)