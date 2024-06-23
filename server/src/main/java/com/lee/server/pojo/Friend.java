package com.lee.server.pojo;

import lombok.Data;
import org.springframework.stereotype.Component;

import javax.persistence.EmbeddedId;
import java.sql.Timestamp;

@Data
public class Friend {
    @EmbeddedId
    private FriendKey key;
    private String status;
    // pendingSend, pendingReceive, accepted, rejectedSend, rejectedReceive, blockedSend, blockedReceive
    private Timestamp createdAt;
}

