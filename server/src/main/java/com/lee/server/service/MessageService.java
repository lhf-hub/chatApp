package com.lee.server.service;

import com.lee.server.pojo.Message;

import java.util.List;

public interface MessageService {
    void sendMessage(Message message);
    List<Message> getUserMessages(String userId);
    List<Message> getGroupMessages(String groupId);
}
