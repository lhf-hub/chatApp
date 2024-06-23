package com.lee.server.mapper;

import com.lee.server.pojo.Group;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface GroupMapper {
    Group findGroupById(String groupId); // 根据id查找群

    List<Group> findGroupsByOwnerId(String userId); // 该用户创建的所有群聊

    List<Group> findGroupsByMemberId(String userId); // 该用户加入的所有群聊

    Boolean createGroup(Group group); // 创建群

    Boolean updateGroup(Group group); // 更新群信息,只有群主才能更新群信息

    Boolean deleteGroup(String groupId, String ownerId); // 删除群,只有群主才能删除群
}
