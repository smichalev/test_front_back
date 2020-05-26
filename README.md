# test_front_back
Authorization / Registration Express + MongoDB + Vue + Vuetify

1. Склонировать репозиторий
2. Установить Mongodb
3. Создать базу данных с именем EnigmaTechnos
4. Перейти в папку основного приложения коммандой cd app
5. Установить все зависимости npm i
6. Запустить npm start
7. Перейти на 127.0.0.1:7777 для проверки приложения.

В случае если порт нужно заменить на другой, делается это в файле app/config/index.js

Так же нужно будет в vue/src/main.js в 9  строке поменять порт.

Сбилдить приложение коммандой npm run build

Папки (css, js, img) в директории vue/dist скопировать в app/assets

А так же все содержимое файла app/templates/index.ejs заменить на содержимое файла vue/dist/index.html

Запустить npm start

Перейти на 127.0.0.1:НОВЫЙ ПОРТ для проверки приложения.
