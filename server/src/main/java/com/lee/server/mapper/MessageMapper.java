package com.lee.server.mapper;

import com.lee.server.pojo.Message;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MessageMapper {
    void save(Message message);
    List<Message> findAllByReceiverId(String receiverId);
    void deleteAllByReceiverId(String receiverId);

    List<Message> findAllByGroupId(String groupId);

    void deleteAllByGroupId(String groupId);

}

