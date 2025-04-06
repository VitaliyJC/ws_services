#!/bin/bash

FILES=(
  "compose/api.yml"
  "compose/postgresql.yml"
  "compose/nginx.yml"
  "compose/admin-panel.yml"
)

COMPOSE_ARGS=""
for FILE in "${FILES[@]}"; do
  COMPOSE_ARGS="$COMPOSE_ARGS -f $FILE"
done

case $1 in
  up)
    docker-compose $COMPOSE_ARGS up -d
    ;;
  down)
    docker-compose $COMPOSE_ARGS down
    ;;
  build)
    if [ "$2" = "clean" ]; then
      echo "Полная пересборка без кэша"
      docker-compose $COMPOSE_ARGS build --no-cache
    else
      echo "Обычная сборка с использованием кэша"
      docker-compose $COMPOSE_ARGS build
    fi
    ;;
  logs)
    docker-compose $COMPOSE_ARGS logs -f --tail=100
    ;;
  restart)
    docker-compose $COMPOSE_ARGS restart $2
    ;;
  *)
    echo "Usage: $0 {up|down|build [clean]|logs|restart <service>}"
    ;;
esac
