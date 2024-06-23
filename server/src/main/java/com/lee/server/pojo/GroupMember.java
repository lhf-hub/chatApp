package com.lee.server.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupMember {
    private String groupId;
    private String userId;
    private String role; // 群主、普通成员 owner member
    private Timestamp joinedAt;

}
