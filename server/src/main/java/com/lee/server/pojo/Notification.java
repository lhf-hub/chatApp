package com.lee.server.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Notification {
    private String senderId;
    private String receiverId;
    private String title;
    private String content;
    private String type;
    private String time;

    public String getContent() {
        return content.length() > 72 ? content.substring(0, 72) + "..." : content;
    }
}
