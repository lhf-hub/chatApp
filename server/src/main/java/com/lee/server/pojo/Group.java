package com.lee.server.pojo;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.sql.Timestamp;
import java.util.Random;
import java.util.UUID;

@Data
public class Group {
    private String id;
    private String name;
    private String description;
    private String ownerId;
    private byte[] profilePicture;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    // 无参构造函数
    public Group() {
        this.id = String.valueOf(new Random().nextInt(900000000) + 100000000);
    }
}


