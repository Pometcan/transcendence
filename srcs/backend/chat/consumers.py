import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from.models import Message
from.serializers import MessageSerializer
from users.serializers import UserBasicInfoSerializer
from users.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

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
        sender_id = text_data_json['sender']
        receiver_id = text_data_json['receiver']
        message = text_data_json['message']
        room_name = text_data_json['room_name']

        sender = await database_sync_to_async(User.objects.get)(id=sender_id)
        receiver = await database_sync_to_async(User.objects.get)(id=receiver_id)
        sender_data = UserBasicInfoSerializer(sender).data
        receiver_data = UserBasicInfoSerializer(receiver).data

        await self.save_message(sender_id, receiver_id, message, room_name)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'sender': sender_data,
                'receiver': receiver_data,
                'message': message,
                'room_name': room_name
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender_data = event['sender']
        receiver_data = event['receiver']

        await self.send(text_data=json.dumps({
            'sender': sender_data,
            'receiver': receiver_data,
            'message': message
        }))

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, content, room_name):
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)
        message = Message(sender=sender, receiver=receiver, content=content, room_name=room_name)
        message.save()