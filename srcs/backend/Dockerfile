FROM python:3.13.1-slim

EXPOSE ${DJANGO_PORT}

WORKDIR /backend

RUN apt-get update && apt-get install -y libpq-dev gcc
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /backend/

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput