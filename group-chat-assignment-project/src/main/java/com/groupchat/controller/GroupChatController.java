package com.groupchat.controller;


import com.groupchat.model.ChatMessage;
import com.groupchat.service.ChatMessageService;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class GroupChatController {

  @Autowired
  private ChatMessageService chatMessageService;

  @MessageMapping("/newUser")
  @SendTo("/topic/public")
  public List<ChatMessage> addUser(@Payload ChatMessage chatMessage,
      SimpMessageHeaderAccessor headerAccessor) {
    Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
    Objects.requireNonNull(sessionAttributes, "Session attributes cant be null");
    sessionAttributes.put("groupChatUser", chatMessage.getSender());
    chatMessageService.save(chatMessage);

    // return chat history
    return chatMessageService.findAll();
  }

  @MessageMapping("/send")
  @SendTo("/topic/public")
  public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
    chatMessageService.save(chatMessage);
    return chatMessage;
  }

}
