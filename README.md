Инструкция по по запуску

1. Установите и запустите docker
2. Перейдите в директорию ws_services

3.1. 
Запуск под bash
```bash
./manage.sh build && ./manage.sh up && ./manage.sh logs
```
Запуск под windows
```bash
./manage.bat build && ./manage.bat up && ./manage.bat logs
```

4. 
Остановка контейнеров под bash
```bash
./manage.sh down
```

Остановка контейнеров под windows
```bash
./manage.bat down
```


Удаление сохраненных данных а базе данных (volumes), после которых БД очищается.
```bash
docker volume rm compose_ws_postgres_data
```
