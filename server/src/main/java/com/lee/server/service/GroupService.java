package com.lee.server.service;

import com.lee.server.pojo.Group;

import java.util.List;

public interface GroupService {
    Group findGroupById(String groupId);
    List<Group> findGroupsByOwnerId(String userId);
    List<Group> findGroupsByMemberId(String userId);
    Boolean createGroup(Group group);
    Boolean updateGroup(Group group);
    Boolean deleteGroup(String groupId, String ownerId);
}
