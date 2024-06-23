package com.lee.server.pojo;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import java.io.IOException;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Base64;

@Data
public class Message implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;                // 消息ID
    private String senderId;          // 发送者ID
    private String receiverId;        // 接收者ID，如果是发给用户，这个字段会被填充
    private String groupId;           // 群组ID，如果是发给群组，这个字段会被填充

    @JsonDeserialize(using = ByteArrayBase64Deserializer.class)
    private byte[] content;           // 消息内容，使用字节数组，适用于小型文本消息

    private String status;            // 消息状态，unread, read
    private String fileUrl;           // 文件URL，适用于大型文件和视频
    private String messageType;       // 消息类型，text, image, video, audio, file
    private Timestamp createdAt;      // 消息创建时间
//
//    public void setContent(String content) {
//        this.content = Base64.getDecoder().decode(content);
//    }
//
    public String getContent() {
        return Base64.getEncoder().encodeToString(this.content);
    }


    public String getCreatedAt() {
        return (createdAt != null) ? createdAt.toString() : "default_value";
    }

    static class ByteArrayBase64Deserializer extends JsonDeserializer<byte[]> {
        @Override
        public byte[] deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            String base64 = p.getValueAsString();
            return Base64.getDecoder().decode(base64);
        }
    }
}

