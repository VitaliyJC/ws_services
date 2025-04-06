@echo off
set CMD=%1
set ARG=%2

set FILES= -f compose\api.yml -f compose\postgresql.yml -f compose\nginx.yml -f compose\admin-panel.yml

if "%CMD%"=="" goto usage
if "%CMD%"=="up" goto up
if "%CMD%"=="down" goto down
if "%CMD%"=="build" goto build
if "%CMD%"=="logs" goto logs
if "%CMD%"=="restart" goto restart

:usage
echo Usage: manage.bat {up|down|build [clean]|logs|restart <service>}
goto end

:up
docker-compose %FILES% up -d
goto end

:down
docker-compose %FILES% down
goto end

:build
if "%ARG%"=="clean" (
  docker-compose %FILES% build --no-cache
) else (
  docker-compose %FILES% build
)
goto end

:logs
docker-compose %FILES% logs -f --tail=100
goto end

:restart
docker-compose %FILES% restart %ARG%
goto end

:end
