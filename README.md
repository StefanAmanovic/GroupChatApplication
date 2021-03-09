# GroupChatApplication
Java Spring Boot (WebSocket) Grup Chat Apploication

Backend: 
 Java Spring Boot Apploication depening on spring-boot-starter-websocket for manipulating incomming message trafic to the defined topic.
 Model manipulation done trough Spring JPA and database used is in memory h2 database (memtestdb)
Frontend:
 JavaScript client used to send, receive and display messages relieing on SockJS and stomp libraries, moment.js used for dataTime formatting.

Start the app with docker with 2 commands in project root:

1. docker build -t groupchatapplication .

2. docker-compose up