FROM openjdk:8-jdk-alpine
COPY target/lib /run/lib
ADD target/GroupChatApplication.jar /run/GroupChatApplication.jar
ENTRYPOINT java -jar run/GroupChatApplication.jar -D exec.mainClass="com.groupchat.GroupChatApplication"
