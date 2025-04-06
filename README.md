Инструкция по по запуску

1. Установите и запустите docker
2. Перейдите в директорию ws_services

3. 
Запуск под bash
```bash
./manage.sh build && ./manage.sh up && ./manage.sh logs
```
Запуск под windows
```bash
./manage.bat build && ./manage.bat up && ./manage.bat logs
```

4. В браузере переходим по адресу и регистрируемся.
```bash
http://localhost/
```

5. 
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
