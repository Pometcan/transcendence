from django.http import JsonResponse
import json
from .models import GameDB
from .models import TMPGameDB
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import logging
import random

logger = logging.getLogger(__name__)


@csrf_exempt
def host_game(request):
    try:
        if request.method != "POST":
            logger.error("Only POST requests are allowed")
            response = {"status": "error", "message": "Only POST requests are allowed"}
            return JsonResponse(response, status=405)

        try:
            data = json.loads(request.body)
            xuser_id = data["user_id"]
            xroom_id = f"ft{random.randint(10000000, 99999999)}"
        except json.JSONDecodeError:
            logger.error("Invalid JSON data")
            response = {"status": "error", "message": "Invalid JSON data"}
            return JsonResponse(response, status=400)
        except KeyError as e:
            logger.error(f"Missing key in JSON data: {e}")
            response = {"status": "error", "message": f"Missing key: {e}"}
            return JsonResponse(response, status=400)

        # Kullanicinin zaten bir oyunda olup olmadiğini kontrol et (player1 veya player2 olarak)
        existing_game = (
            TMPGameDB.objects.filter(player1_id=xuser_id).first()
            or TMPGameDB.objects.filter(player2_id=xuser_id).first()
        )
        if existing_game:
            logger.error(
                f"{xuser_id} Oyuna tekrar katiliyor room_id: {existing_game.room_id}"
            )
            response = {
                "status": "success",
                "message": f"{xuser_id} Oyuna tekrar katiliyor",
                "room_id": existing_game.room_id,
            }
            return JsonResponse(response)

        # Yeni oda olustur
        now = timezone.now()
        date_string = now.strftime("%Y-%m-%d %H:%M:%S")

        TMPGameDB.objects.create(
            room_id=xroom_id, player1_id=xuser_id, create_date=date_string
        )

        logger.error(f"{xuser_id} oda olusturdu room_id: {xroom_id}")
        response = {
            "status": "success",
            "message": f"Oda olusturuldu {xroom_id}",
            "room_id": xroom_id,
        }
        return JsonResponse(response)

    except Exception as e:
        logger.error(f"Unknown Error Type: {e}")
        response = {"status": "error", "message": f"Unknown Error Type: {e}"}
        return JsonResponse(response, status=403)


@csrf_exempt
def join_game(request):
    try:
        if request.method == "POST":
            try:
                data = json.loads(request.body)
                xuser_id = data["user_id"]
                xroom_id = data["room_id"]

                # Kullanicinin zaten oyunda olup olmadiğini kontrol et (player1 olarak)
                game_as_player1 = TMPGameDB.objects.filter(player1_id=xuser_id).first()
                if game_as_player1:
                    logger.error(
                        f"{xuser_id} Devam etmekte olan oyuna yeniden katiliyor"
                    )
                    response = {
                        "status": "success",
                        "message": f"{xuser_id} Devam etmekte olan oyuna yeniden katiliyor",
                        "room_id": game_as_player1.room_id,
                    }
                    return JsonResponse(response)

                # Kullanicinin zaten oyunda olup olmadiğini kontrol et (player2 olarak)
                game_as_player2 = TMPGameDB.objects.filter(player2_id=xuser_id).first()
                if game_as_player2:
                    logger.error(
                        f"{xuser_id} Devam etmekte olan oyuna yeniden katiliyor"
                    )
                    response = {
                        "status": "success",
                        "message": f"{xuser_id} Devam etmekte olan oyuna yeniden katiliyor",
                        "room_id": game_as_player2.room_id,
                    }
                    return JsonResponse(response)

                # Odaya katilma islemi
                room = TMPGameDB.objects.filter(room_id=xroom_id).first()
                if room:
                    if not room.player2_id:  # Eğer player2 bossa odaya katil
                        room.player2_id = xuser_id
                        room.save()
                        logger.error(f"Odaya katilindi {xroom_id}")
                        response = {
                            "status": "success",
                            "message": f"Odaya katilindi {xroom_id}",
                            "room_id": room.room_id,
                        }
                        return JsonResponse(response)
                    elif room.player2_id == xuser_id:
                        response = {
                            "status": "success",
                            "message": "devam etmekte olan oyuna yeniden katilindi",
                            "room_id": room.room_id,
                        }
                        return JsonResponse(response)
                    else:
                        logger.error(f"Oda dolu: {room.room_id}")
                        response = {
                            "status": "error",
                            "message": f"Oda dolu: {room.room_id}",
                        }
                        return JsonResponse(response, status=400)
                else:
                    logger.error(f"Oda bulunamadi: {xroom_id}")
                    response = {
                        "status": "error",
                        "message": f"Oda bulunamadi: {xroom_id}",
                    }
                    return JsonResponse(response, status=404)

            except json.JSONDecodeError:
                logger.error("Invalid JSON data")
                response = {"status": "error", "message": "Invalid JSON data"}
                return JsonResponse(response, status=400)
        else:
            logger.error("Only POST requests are allowed")
            response = {"status": "error", "message": "Only POST requests are allowed"}
            return JsonResponse(response, status=405)
    except Exception as e:
        logger.error(f"Unknown Error Type: {e}")
        response = {"status": "error", "message": f"Unknown Error Type: {e}"}
        return JsonResponse(response, status=403)


# for debug
def reset_db(request):
    try:
        if request.method == "GET":
            gameobjs = GameDB.objects.all()
            tmpgameobjs = TMPGameDB.objects.all()

            gameobjs_count = gameobjs.count()
            tmpgameobjs_count = tmpgameobjs.count()
            gameobjs.delete()
            tmpgameobjs.delete()
            ret = {
                "status": "success",
                "message": f"Game Databases are deleted. Delete counts, GameDB = {gameobjs_count} TMPGameDB= {tmpgameobjs_count}",
            }
            logger.error(
                f"Game Databases are deleted. GameDB = {gameobjs_count} TMPGameDB= {tmpgameobjs_count}"
            )
            return JsonResponse(ret)
        else:
            return JsonResponse(
                {"status": "error", "message": "only GET method allowed"}, status=400
            )
    except Exception as e:
        logger.error(f"reset_db Error: {e}")
        return JsonResponse({"status": "error", "message": f"{e}"}, status=400)
    return JsonResponse({"status": "error", "message": "Unknown Error"}, status=400)

def get_db(request):
    try:
        if request.method == "GET":
            gameobjs = GameDB.objects.all()
            gameobjs_count = gameobjs.count()
            games = []
            if gameobjs_count > 0:
                for game in gameobjs:
                    games.append({
                        "player1_id": game.player1_id,
                        "player2_id": game.player2_id,
                        "player1_score": game.player1_score,
                        "player2_score": game.player2_score,
                        "create_date": game.create_date, # Tarih objesini stringe çeviriyoruz
                        "end_date": game.end_date, # Tarih objesini stringe çeviriyoruz
                        "winner_id": game.winner_id,
                    })
            ret = {
                "status": "success",
                "message": games,
            }
            logger.error(ret) # Log kaydı JSON formatında olacak
            return JsonResponse(ret)
        else:
            return JsonResponse(
                {"status": "error", "message": "only GET method allowed"}, status=400
            )
    except Exception as e:
        logger.error(f"reset_db Error: {e}")
        return JsonResponse({"status": "error", "message": f"{e}"}, status=400)
