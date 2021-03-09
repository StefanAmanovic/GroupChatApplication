package com.groupchat.service;

import com.groupchat.model.ChatMessage;
import com.groupchat.repository.ChatMessageRepository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatMessageService {

  @Autowired
  private ChatMessageRepository chatMessageRepository;

  public List<ChatMessage> findAll() {
    List<ChatMessage> messages = new ArrayList<>();
    chatMessageRepository.findAll()
        .forEach(messages::add);
    return messages;
  }

  public void save(ChatMessage chatMessage) {
    chatMessageRepository.save(chatMessage);
  }
}
