import json
import asyncio
from re import A
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
import threading
import time

logger = logging.getLogger(__name__)

ONLINE_USERS = set()

class OnlineUsersConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.isConnected = False
        await self.accept()
        self.isConnected = True
        logger.error(f"User {self.user_id} connected globally")
        if self.user_id not in ONLINE_USERS:
            ONLINE_USERS.add(self.user_id)
        asyncio.create_task(self.Update())

    async def disconnect(self, close_code):
        ONLINE_USERS.discard(self.user_id)
        logger.error(f"User {self.user_id} disconnected globally")
        self.isConnected = False

    async def send_user_list(self):
        user_list = list(ONLINE_USERS)
        await self.send(text_data=json.dumps({
            "type": "online_user_list",
            "users": user_list
        }))

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            if message_type == 'ping':
                await self.send(text_data=json.dumps({"type": "pong"}))
            else:
                logger.warning(f"Unknown message type received: {message_type}")

        except json.JSONDecodeError:
            logger.error("Invalid JSON received")
        except Exception as e:
            logger.error(f"Receive error: {e}")

    async def Update(self):
        while self.isConnected:
            await self.send_user_list()
            await asyncio.sleep(1)
