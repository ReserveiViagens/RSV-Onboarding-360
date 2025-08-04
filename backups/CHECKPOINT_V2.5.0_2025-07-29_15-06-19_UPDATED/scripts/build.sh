#!/bin/bash

# This script builds all the Docker images for the Onion 360 RSV project.

echo "Building Docker images..."

# Build base images if necessary
# docker build -t rsv/base-python:latest -f backend/Dockerfile.base .

# Build microservice images
docker build -t rsv/core-service:latest ./backend/core
docker build -t rsv/travel-service:latest ./backend/travel
docker build -t rsv/finance-service:latest ./backend/finance
docker build -t rsv/notifications-service:latest ./backend/notifications
docker build -t rsv/tickets-service:latest ./backend/tickets
docker build -t rsv/parks-service:latest ./backend/parks
docker build -t rsv/attractions-service:latest ./backend/attractions
docker build -t rsv/inventory-service:latest ./backend/inventory
docker build -t rsv/sales-service:latest ./backend/sales
docker build -t rsv/marketing-service:latest ./backend/marketing
docker build -t rsv/analytics-service:latest ./backend/analytics
docker build -t rsv/seo-service:latest ./backend/seo
docker build -t rsv/multilingual-service:latest ./backend/multilingual
docker build -t rsv/subscriptions-service:latest ./backend/subscriptions
docker build -t rsv/giftcards-service:latest ./backend/giftcards
docker build -t rsv/coupons-service:latest ./backend/coupons
docker build -t rsv/rewards-service:latest ./backend/rewards
# ... add build commands for all other backend services

# Build frontend image
docker build -t rsv/frontend:latest ./frontend

echo "Docker images built successfully." 