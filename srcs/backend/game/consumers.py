import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
from .models import GameDB
from .models import TMPGameDB
from datetime import datetime
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)

# Global game state dictionary
GAME_STATES = {}
GAME_TASKS = {} # Update gorevleri

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.error("Websocket bağlanıyor")
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.group_name = self.room_id
        self.game_over = False
        self.isHost = False # Default host degil

        if self.room_id not in GAME_STATES:
            GAME_STATES[self.room_id] = {
                "p1_y": 50,
                "p2_y": 50,
                "ball_x": 50,
                "ball_y": 50,
                "ball_dx": 0.8,
                "ball_dy": 0.8,
                "ball_speed": 0.8,
                "p1_score": 0,
                "p2_score": 0,
                "startGame": False,
                "gameRunning": True,
                "host_id": None,  # Yeni: Host kullanici id'si
                "connected_users": set(), # Yeni : bağlı olan kullanıcılar
            }

        self.game_state = GAME_STATES[self.room_id]

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        userCanJoinRoom = False

        try:
            rooms = await sync_to_async(list)(TMPGameDB.objects.all())

            for room in rooms:
                if room.room_id == self.room_id:
                    if room.player1_id == self.user_id:
                        self.isHost = True
                        userCanJoinRoom = True
                        self.game_state["host_id"] = self.user_id
                    elif room.player2_id == self.user_id:
                        userCanJoinRoom = True
                        self.game_state['startGame'] = True
                    else:
                        userCanJoinRoom = False
                    break

        except Exception as e:
            logger.error(f"game/Consumer.py Error {e}")
            await self.close()
            return

        if userCanJoinRoom:
            await self.accept()
            self.game_state["connected_users"].add(self.user_id) # kullanıcıyı ekle
            if self.isHost and self.room_id not in GAME_TASKS:
                GAME_TASKS[self.room_id] = asyncio.create_task(self.game_update_loop())
            logger.error(f"{self.user_id} şu oyuna {self.room_id} katildi")
        else:
            logger.error(
                f"error: {self.user_id} şu oyuna {self.room_id} katilamadi çünkü gameDb'de bulunamadi"
            )
            await self.close()

    async def game_update_loop(self):
         # Sadece bir host update yapsin
        while self.game_state["gameRunning"]:
             if self.game_state['startGame']:
                 await self.update_ball()
                 await asyncio.sleep(0.016)
             else:
                logger.error("oyun baslamasi bekleniyor")
                await asyncio.sleep(1)
        if self.game_over:
            await self.endOfGame()


    async def update_ball(self):
        # Topun pozisyonunu güncelle
        self.game_state["ball_x"] += self.game_state["ball_dx"] * self.game_state["ball_speed"]
        self.game_state["ball_y"] += self.game_state["ball_dy"] * self.game_state["ball_speed"]

        # Topun canvas sınırlarına çarpma kontrolü
        if self.game_state["ball_y"] <= 0 or self.game_state["ball_y"] >= 100:
            self.game_state["ball_dy"] *= -1  # Dikey yönü tersine çevir

        # Paddle'lara çarpma kontrolü
        if (
            self.game_state["ball_x"] <= 5
            and self.game_state["ball_y"] > (self.game_state["p1_y"] - 10)
            and self.game_state["ball_y"] < (self.game_state["p1_y"] + 10 + 10)
        ):
            self.game_state["ball_dx"] *= -1  # Yatay yönü tersine çevir

        if (
            self.game_state["ball_x"] >= 95
            and self.game_state["ball_y"] > (self.game_state["p2_y"] - 10)
            and self.game_state["ball_y"] < (self.game_state["p2_y"] + 10 + 10)
        ):
            self.game_state["ball_dx"] *= -1  # Yatay yönü tersine çevir

        # Topun skor yapma kontrolü (yatay sınırlara çarpma)
        if self.game_state["ball_x"] <= 0:
            self.game_state["p2_score"] += 1
            self.game_state["ball_x"] = 50
            self.game_state["ball_y"] = 50
            self.game_state["ball_dx"] *= -1
        elif self.game_state["ball_x"] >= 100:
            self.game_state["p1_score"] += 1
            self.game_state["ball_x"] = 50
            self.game_state["ball_y"] = 50
            self.game_state["ball_dx"] *= -1

        # Skor kontrolü
        if self.game_state["p1_score"] >= 10 or self.game_state["p2_score"] >= 10:
            self.game_over = True
            self.game_state["gameRunning"] = False
            logger.error("OYUN BITTI")

        await self.send_msg({
            "type": "update_ball",
            "ball_x": self.game_state["ball_x"],
            "ball_y": self.game_state["ball_y"],
            "p1_score": self.game_state["p1_score"],
            "p2_score": self.game_state["p2_score"],
            "ball_speed": self.game_state["ball_speed"],
        })

        if self.game_over:
            await self.endOfGame()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        self.game_state["connected_users"].discard(self.user_id) # kullanıcıyı sil

        if len(self.game_state["connected_users"]) == 0: # kullanıcı sayısı 0 ise
            logger.error(f"{self.room_id} odadaki bütün oyuncular cikti oyun sonlandi")
            self.game_over = True # oyunu sonlandır
            if self.room_id in GAME_TASKS:
                GAME_TASKS[self.room_id].cancel() # Gorevi iptal et
                del GAME_TASKS[self.room_id]


    async def receive(self, text_data):
        logger.error("receive cagrildi")
        try:
            text_data_json = json.loads(text_data)

            if "type" not in text_data_json:
                await self.send(
                    json.dumps(
                        {
                            "status": "error",
                            "message": "There must be type key as json format",
                        }
                    )
                )
            else:
                type = text_data_json["type"]
                if type == "ping":
                    await self.send(
                        json.dumps(
                            {
                                "status": "success",
                                "message": "pong",
                            }
                        )
                    )
                elif type == "move" and self.game_state["startGame"]:
                    direction = text_data_json["direction"]
                    if direction == "up":
                        if self.user_id == self.game_state["host_id"] and self.game_state["p1_y"] > 0 and self.game_state["p1_y"] <= 100:
                            self.game_state["p1_y"] -= 10
                            await self.send_msg({"type": "move", "p1_y": self.game_state["p1_y"], "user_id": self.user_id})
                        elif self.user_id != self.game_state["host_id"] and self.game_state["p2_y"] > 0 and self.game_state["p2_y"] <= 100:
                            self.game_state["p2_y"] -= 10
                            await self.send_msg({"type": "move", "p2_y": self.game_state["p2_y"], "user_id": self.user_id})
                    elif direction == "down":
                         if self.user_id == self.game_state["host_id"] and self.game_state["p1_y"] >= 0 and self.game_state["p1_y"] < 100:
                            self.game_state["p1_y"] += 10
                            await self.send_msg({"type": "move", "p1_y": self.game_state["p1_y"], "user_id": self.user_id})
                         elif self.user_id != self.game_state["host_id"] and self.game_state["p2_y"] >= 0 and self.game_state["p2_y"] < 100:
                            self.game_state["p2_y"] += 10
                            await self.send_msg({"type": "move", "p2_y": self.game_state["p2_y"], "user_id": self.user_id})
                    logger.error(f"p1_y ={self.game_state['p1_y']} p2_y {self.game_state['p2_y']}")
        except Exception as e:
            logger.error(f"receive Error :{e}")

    async def send_msg(self, jsonmsg):
        await self.channel_layer.group_send(
            self.group_name, {"type": "group_message", "jsonmsg": jsonmsg}
        )

    async def group_message(self, event):
        jsonmsg = event["jsonmsg"]
        await self.send(json.dumps(jsonmsg))

    async def endOfGame(self):
        try:
             room = await sync_to_async(
                 TMPGameDB.objects.filter(room_id=self.room_id).first
             )()
             if room:
                if self.game_state["connected_users"]:
                    if room.player1_id and room.player2_id:
                        p1_win = self.game_state["p1_score"] > self.game_state["p2_score"]
                        if p1_win:
                            room.winner_id = room.player1_id
                        else:
                            room.winner_id = room.player2_id
                        room.end_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        await sync_to_async(room.save)()

                        await sync_to_async(GameDB.objects.create)(
                            room_id=room.room_id,
                            player1_id=room.player1_id,
                            player1_score=self.game_state["p1_score"],
                            player2_id=room.player2_id,
                            player2_score=self.game_state["p2_score"],
                            winner_id=room.winner_id,
                            create_date=room.create_date,
                            end_date=room.end_date,
                        )
                        logger.error(f"{self.user_id} Oyun verileri kayit edildi.")
                        if p1_win:
                            logger.error(f"{room.winner_id} oyunu kazandi score {self.game_state['p1_score']} {self.game_state['p2_score']}")
                        else:
                            logger.error(f"{room.winner_id} oyunu kazandi score {self.game_state['p2_score']} {self.game_state['p1_score']}")

                        await self.send_msg({"type": "disconnect", "Winner": room.winner_id})
                        logger.error(f"{room.room_id} oda silindi.")
                        await sync_to_async(room.delete)()
                        self.game_over = True
                        if self.room_id in GAME_TASKS:
                            GAME_TASKS[self.room_id].cancel()
                            del GAME_TASKS[self.room_id]
                else:
                    logger.error(f"{room.room_id} oda silindi Kazanan/Kaybeden olmadi.")
                    await sync_to_async(room.delete)()
                    self.game_over = True
                    if self.room_id in GAME_TASKS:
                        GAME_TASKS[self.room_id].cancel()
                        del GAME_TASKS[self.room_id]
                    await self.send_msg({"type": "disconnect", "Winner": None})

             else:
                logger.error(f"Oda {self.room_id} bulunamadi disconnect oldun.")
                self.game_over = True
                await self.disconnect(1000)
                if self.room_id in GAME_TASKS:
                        GAME_TASKS[self.room_id].cancel()
                        del GAME_TASKS[self.room_id]


        except Exception as e:
            logger.error(f"endOfGame metodunda hata: {e}")
