package com.lee.server.mapper;

import com.lee.server.pojo.GroupMember;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface GroupMemberMapper {

    Boolean addGroupMember(GroupMember groupMember);
    Boolean removeGroupMember(String groupId, String userId);
    List<GroupMember> findGroupMembers(String groupId);
    List<GroupMember> findGroupMembersByNameOrId(String groupId, String nameOrId);
    Boolean isGroupMember(String groupId, String userId);
    Boolean isGroupOwner(String groupId, String userId);
    Boolean demoteOldOwner(String groupId, String ownerId);
    Boolean setGroupNewOwner(String groupId, String newOwnerId);
    Boolean removeAllGroupMembers(String groupId);
    Boolean removeAllGroupMembersExceptOwner(String groupId, String ownerId);


    List<String> getGroupIdsByUserId(String userId);

    Boolean addGroupMembers(List<GroupMember> groupMembers);
}

//public interface GroupMember {
//    Boolean addGroupMember(String groupId, String userId); // 添加群成员，添加群成员后推送消息
//    Boolean addGroupMembers(String groupId, List<String> userIds); // 添加多个群成员，添加群成员后推送消息
//    Boolean removeGroupMember(String groupId, String ownerId, String userId); // 群主可以删除除自己外的任意群成员，删除群成员后推送消息
//    Boolean removeGroupMembers(String groupId, String ownerId, List<String> userIds); // 群主可以删除除自己外的任意多个群成员，删除群成员后推送消息
//    List<GroupMember> findGroupMembers(String groupId); // 查找所有群成员并携带角色信息等(所有信息）
//    List<GroupMember> findGroupMembersByNameOrId(String groupId, String nameOrId); // 根据nameOrId查找群成员并携带角色信息等(所有信息）
//    Boolean isGroupMember(String groupId, String userId); // 判断是否是群成员
//    Boolean isGroupOwner(String groupId, String userId); // 判断是否是群主
//    Boolean setGroupNewOwner(String groupId, String ownerId, String newOwnerId); // 只有群主才能转让群主(原群主自动变为普通成员),转让群主后推送消息
//    Boolean exitGroup(String groupId, String userId); // 只有普通成员能够退出群，退出群后推送消息给群主
//}

