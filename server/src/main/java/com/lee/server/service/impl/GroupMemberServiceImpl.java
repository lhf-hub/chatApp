package com.lee.server.service.impl;

import com.lee.server.mapper.GroupMemberMapper;
import com.lee.server.pojo.GroupMember;
import com.lee.server.service.GroupMemberService;
import com.lee.server.socket.SocketIOService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

@Service
public class GroupMemberServiceImpl implements GroupMemberService {

    @Autowired
    private GroupMemberMapper groupMemberMapper;

    @Autowired
    private SocketIOService socketIOService;

    @Override
    @Transactional
    public Boolean addGroupMember(GroupMember groupMember) {
//        groupMember.setJoinedAt(new Timestamp(System.currentTimeMillis()));
        System.out.println(groupMember);
        Boolean result = groupMemberMapper.addGroupMember(groupMember);
        if (result) {
            socketIOService.pushMessageToUser(groupMember.getUserId(), "You have been added to group " + groupMember.getGroupId(), "notification_event");
        }
        return result;
    }

    @Override
    @Transactional
    public Boolean removeGroupMember(String groupId, String userId) {
        boolean result = groupMemberMapper.removeGroupMember(groupId, userId);
        if (result) {
            socketIOService.pushMessageToUser(userId, "You have been removed from group " + groupId, "notification_event");
        }
        return result;
    }

    @Override
    public List<GroupMember> findGroupMembers(String groupId) {
        return groupMemberMapper.findGroupMembers(groupId);
    }

    @Override
    public List<GroupMember> findGroupMembersByNameOrId(String groupId, String nameOrId) {
        return groupMemberMapper.findGroupMembersByNameOrId(groupId, nameOrId);
    }



    @Override
    @Transactional
    public Boolean setGroupNewOwner(String groupId, String ownerId, String newOwnerId) {
        boolean demoteResult = groupMemberMapper.demoteOldOwner(groupId, ownerId);
        boolean promoteResult = groupMemberMapper.setGroupNewOwner(groupId, newOwnerId);
        if (demoteResult && promoteResult) {
            socketIOService.pushMessageToUser(newOwnerId, "You have been promoted to group owner for group " + groupId, "notification_event");
        }
        return demoteResult && promoteResult;
    }

    @Override
    @Transactional
    public Boolean exitGroup(String groupId, String userId) {
        Boolean result = groupMemberMapper.removeGroupMember(groupId, userId);
        if (result) {
            socketIOService.pushMessageToUser(userId, "You have exited group " + groupId, "notification_event");
            return true;
        }
        return false;
    }

    @Override
    public Boolean addGroupMembers(List<GroupMember> groupMembers) {
        Boolean result =  groupMemberMapper.addGroupMembers(groupMembers);
        if (result) {
            for (GroupMember groupMember : groupMembers) {
                socketIOService.pushMessageToUser(groupMember.getUserId(), "You have been added to group " + groupMember.getGroupId(), "notification_event");
            }
        }
        return result;
    }
}
