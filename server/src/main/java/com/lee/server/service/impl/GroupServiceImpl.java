package com.lee.server.service.impl;

import com.lee.server.mapper.GroupMapper;
import com.lee.server.mapper.GroupMemberMapper;
import com.lee.server.pojo.Group;
import com.lee.server.pojo.GroupMember;
import com.lee.server.service.GroupService;
import com.lee.server.socket.SocketIOService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

@Service
public class GroupServiceImpl implements GroupService {

    @Autowired
    private GroupMapper groupMapper;

    @Autowired
    private GroupMemberMapper groupMemberMapper;

    @Autowired
    private SocketIOService socketIOService;

    @Override
    public Group findGroupById(String groupId) {
        return groupMapper.findGroupById(groupId);
    }

    @Override
    public List<Group> findGroupsByOwnerId(String userId) {
        return groupMapper.findGroupsByOwnerId(userId);
    }

    @Override
    public List<Group> findGroupsByMemberId(String userId) {
        return groupMapper.findGroupsByMemberId(userId);
    }

    @Override
    @Transactional
    public Boolean createGroup(Group group) {
        //            socketIOService.pushMessageToUser(group.getOwnerId(), "Group " + group.getName() + " created successfully", "notification_event");
        return groupMapper.createGroup(group) &&
            groupMemberMapper.addGroupMember(new GroupMember(group.getId(), group.getOwnerId(), "owner", new Timestamp(System.currentTimeMillis())));
    }

    @Override
    @Transactional
    public Boolean updateGroup(Group group) {
        return groupMapper.updateGroup(group);
    }

    @Override
    @Transactional
    public Boolean deleteGroup(String groupId, String ownerId) {
        return groupMemberMapper.removeAllGroupMembers(groupId) && groupMapper.deleteGroup(groupId, ownerId) ;
    }
}
