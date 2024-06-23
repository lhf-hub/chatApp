package com.lee.server.pojo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class User {
    private String id;
    private String name;
    private String password;
    private byte[] profilePicture;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
