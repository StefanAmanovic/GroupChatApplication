package com.groupchat.controller;


import com.groupchat.model.ChatMessage;
import com.groupchat.service.ChatMessageService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class GroupChatEventListener {

  @Autowired
  private SimpMessageSendingOperations messagingTemplate;

  @Autowired
  private ChatMessageService chatMessageService;

  @EventListener
  public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
    Objects.requireNonNull(sessionAttributes, "Session attributes cant be null");

    String groupChatUser = String.valueOf(sessionAttributes.get("groupChatUser"));
    if (groupChatUser != null) {
      // User disconnected - send LEAVE chatMessage
      ChatMessage chatMessage = new ChatMessage();
      chatMessage.setType(ChatMessage.Type.LEAVE);
      chatMessage.setDateTime(LocalDateTime.now());
      chatMessage.setSender(groupChatUser);

      chatMessageService.save(chatMessage);
      messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }
  }
}
