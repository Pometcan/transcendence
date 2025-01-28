from django.http import JsonResponse


# def OrnekVeriAtma(request):
#     data = {
#         "Ornek Veri":0, "Herhangi bir bilgi olabilir JSON turu oldugu taktirde":0
#     }
#     return JsonResponse(data)

# def OrnekVeriCekme(request):
#     return JsonResponse({"evet":"oldu"})

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from django.middleware.csrf import get_token

# class CSRFTokenView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         csrf_token = get_token(request)  # Django CSRF token'ı oluştur
#         response = Response({'csrfToken': csrf_token})
#         response.set_cookie('csrftoken', csrf_token, httponly=True, secure=True, samesite='None')
#         response.headers["Acces-Control-Allow-Origin"] = 'https://localhost'
#         response.headers["Acces-Control-Allow-Credentials"] = 'true'
#         return response
    
# from datetime import datetime, timedelta
# class RefreshTokenView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         refresh_token = request.COOKIES.get('refresh')

#         if not refresh_token:
#             return Response({'error': 'Refresh token not found'}, status=400)

#         try:
#             payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
#         except jwt.ExpiredSignatureError:
#             return Response({'error': 'Refresh token expired'}, status=401)

#         # Yeni access token oluştur
#         new_access_payload = {
#             'id': payload['id'],
#             'exp': datetime.utcnow() + timedelta(minutes=15),
#         }
#         new_access_token = jwt.encode(new_access_payload, settings.SECRET_KEY, algorithm='HS256')

#         return Response({
#             'access': new_access_token
#         })