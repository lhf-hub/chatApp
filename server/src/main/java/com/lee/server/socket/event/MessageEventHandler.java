package com.lee.server.socket.event;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lee.server.mapper.MessageMapper;
import com.lee.server.pojo.Message;
import com.lee.server.pojo.Notification;
import com.lee.server.socket.impl.SocketIOServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@CustomEvents
@Component
public class MessageEventHandler {

    @Lazy
    @Autowired
    private SocketIOServiceImpl socketIOService;

    @Autowired
    MessageMapper messageMapper;


    @CustomEvent(EventNameSend.sendMessage)
    public void onSendMessage(SocketIOClient client, String data, AckRequest ackRequest) {

        System.out.println("我来咯，但我是错的！！！！！！！！！！");

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // 反序列化为 Message 对象
            Message message = objectMapper.readValue(data, Message.class);
//            System.out.println("反序列化后的数据: " + message);

            // 检查接收者是否在线
            if (socketIOService.isUserOnline(message.getReceiverId())) {
                System.out.println("用户在线: " + message.getReceiverId() + "，发送消息: " + message.getContent());
                // 发送消息给在线用户
                socketIOService.pushMessageToUser(message.getReceiverId(), message, EventNameSend.receiveMessage);
                // 消息推送通知
                socketIOService.pushMessageToUser(message.getReceiverId(), new Notification(
                        message.getSenderId(),
                        message.getReceiverId(),
                        "You have a new message",
                        message.getContent(),
                        message.getMessageType(),
                        message.getCreatedAt().substring(5, 16)
                ), EventNameSend.receiveMessageNotification);
            } else {
                // 存储离线消息
//                System.out.println("用户不在线: " + message.getReceiverId() + "，存储消息: " + message);
                messageMapper.save(message);
            }
        } catch ( JsonProcessingException e) {
            e.printStackTrace();
        }
    }


    @CustomEvent(EventNameSend.sendGroupMessage)
    public void onSendGroupMessage(SocketIOClient client, String data, AckRequest ackRequest) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // 反序列化为 Message 对象
            Message message = objectMapper.readValue(data, Message.class);
            // 发送消息
            socketIOService.pushMessageToGroup(message.getGroupId(), message, EventNameSend.receiveGroupMessage, message.getSenderId());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
