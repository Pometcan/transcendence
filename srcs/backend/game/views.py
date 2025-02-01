from django.http import JsonResponse
import json
from .models import GameDB
from .models import TMPGameDB
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import logging

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
            xroom_id = data["room_id"]
        except json.JSONDecodeError:
            logger.error("Invalid JSON data")
            response = {"status": "error", "message": "Invalid JSON data"}
            return JsonResponse(response, status=400)
        except KeyError as e:
            logger.error(f"Missing key in JSON data: {e}")
            response = {"status": "error", "message": f"Missing key: {e}"}
            return JsonResponse(response, status=400)

        # Kullanıcının zaten bir oyunda olup olmadığını kontrol et (player1 veya player2 olarak)
        existing_game = (
            TMPGameDB.objects.filter(player1_id=xuser_id).first()
            or TMPGameDB.objects.filter(player2_id=xuser_id).first()
        )
        if existing_game:
            logger.error(f"{xuser_id} Zaten oyunda room_id: {existing_game.room_id}")
            response = {
                "status": "error",
                "message": f"{xuser_id} Zaten oyunda room_id: {existing_game.room_id}",
            }
            return JsonResponse(response, status=400)

        # Yeni oda oluştur
        now = timezone.now()
        date_string = now.strftime("%Y-%m-%d %H:%M:%S")

        TMPGameDB.objects.create(
            room_id=xroom_id, player1_id=xuser_id, create_date=date_string
        )

        logger.error(f"{xuser_id} oda oluşturdu room_id: {xroom_id}")
        response = {
            "status": "success",
            "message": f"Oda oluşturuldu {xroom_id}",
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

                # Kullanıcının zaten oyunda olup olmadığını kontrol et (player1 olarak)
                game_as_player1 = TMPGameDB.objects.filter(player1_id=xuser_id).first()
                if game_as_player1:
                    logger.error(
                        f"{xuser_id} Zaten oyunda (player1) room_id: {game_as_player1.room_id}"
                    )
                    response = {
                        "status": "error",
                        "message": f"{xuser_id} Zaten oyunda (player1) room_id: {game_as_player1.room_id}",
                    }
                    return JsonResponse(response, status=400)

                # Kullanıcının zaten oyunda olup olmadığını kontrol et (player2 olarak)
                game_as_player2 = TMPGameDB.objects.filter(player2_id=xuser_id).first()
                if game_as_player2:
                    logger.error(
                        f"{xuser_id} Zaten oyunda (player2) room_id: {game_as_player2.room_id}"
                    )
                    response = {
                        "status": "error",
                        "message": f"{xuser_id} Zaten oyunda (player2) room_id: {game_as_player2.room_id}",
                    }
                    return JsonResponse(response, status=400)

                # Odaya katılma işlemi
                room = TMPGameDB.objects.filter(room_id=xroom_id).first()
                if room:
                    if not room.player2_id:  # Eğer player2 boşsa odaya katıl
                        room.player2_id = xuser_id
                        room.save()
                        logger.error(f"Odaya katilindi {xroom_id}")
                        response = {
                            "status": "success",
                            "message": f"Odaya katilindi {xroom_id}",
                        }
                        return JsonResponse(response)
                    else:
                        logger.error(f"Oda dolu: {xroom_id}")
                        response = {
                            "status": "error",
                            "message": f"Oda dolu: {xroom_id}",
                        }
                        return JsonResponse(response, status=400)
                else:
                    logger.error(f"Oda bulunamadı: {xroom_id}")
                    response = {
                        "status": "error",
                        "message": f"Oda bulunamadı: {xroom_id}",
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
