package com.lee.server.service;

import com.lee.server.pojo.GroupMember;

import java.util.List;

public interface GroupMemberService {
    Boolean addGroupMember(GroupMember groupMember);
    Boolean removeGroupMember(String groupId, String userId);
    List<GroupMember> findGroupMembers(String groupId);
    List<GroupMember> findGroupMembersByNameOrId(String groupId, String nameOrId);
    Boolean setGroupNewOwner(String groupId, String ownerId, String newOwnerId);
    Boolean exitGroup(String groupId, String userId);

    Boolean addGroupMembers(List<GroupMember> groupMembers);
}
