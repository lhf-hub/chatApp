package com.lee.server.service.impl;


import com.lee.server.mapper.FriendMapper;
import com.lee.server.pojo.Friend;
import com.lee.server.pojo.FriendKey;
import com.lee.server.service.FriendService;
import com.lee.server.socket.SocketIOService;
import com.lee.server.socket.event.EventNameSend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FriendServiceImpl implements FriendService {

    @Autowired
    private FriendMapper friendMapper;

    @Lazy
    @Autowired
    private SocketIOService socketIOService;

    @Override
    public Friend findByPrimaryKey(FriendKey key) {
        return friendMapper.findByPrimaryKey(key);
    }

    @Override
    public List<Friend> findByUserId(String userId) {
        return friendMapper.findByUserId(userId);
    }

    @Override
    public List<Friend> findByNameOrFriendId(String userId, String nameOrFriendId) {
        return friendMapper.findByNameOrFriendId(userId, nameOrFriendId);
    }

    @Override
    public List<Friend> findCanAccept(String userId) {
        return friendMapper.findCanAccept(userId);
    }

    @Override
    @Transactional
    public boolean addFriend(FriendKey key) {
        int result1 = friendMapper.addFriend(key);
        int result2 = friendMapper.addFriendReverse(key);
        if (result1 > 0 && result2 > 0) {
            // 通知对方
            socketIOService.pushMessageToUser(key.getFriendId(), "You have a new friend request from " + key.getUserId(), EventNameSend.addFriend);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean acceptFriend(FriendKey key) {
        int result1 = friendMapper.acceptFriendFirstStep(key); // 更新自己的状态
        int result2 = friendMapper.acceptFriendSecondStep(key); // 更新对方的状态
        if (result1 > 0 && result2 > 0) {
            System.out.println("acceptFriend: " + key.getUserId() + " " + key.getFriendId());
            // 通知对方
            socketIOService.pushMessageToUser(key.getFriendId(), "Your friend request has been accepted by " + key.getUserId(), EventNameSend.acceptFriend);
            return true;
        }
        System.out.println("acceptFriend: " + key.getUserId() + " " + key.getFriendId()+ " failed");
        return false;
    }

    @Override
    @Transactional
    public boolean rejectFriend(FriendKey key) {
        int result1 = friendMapper.rejectFriendFirstStep(key);
        int result2 = friendMapper.rejectFriendSecondStep(key);
        if (result1 > 0 && result2 > 0) {
            // 通知对方
            socketIOService.pushMessageToUser(key.getFriendId(), "Your friend request has been rejected by " + key.getUserId(), EventNameSend.rejectFriend);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean blockFriend(FriendKey key) {
        int result1 = friendMapper.blockFriendFirstStep(key);
        int result2 = friendMapper.blockFriendSecondStep(key);
        if (result1 > 0 && result2 > 0) {
            // 通知对方
            socketIOService.pushMessageToUser(key.getFriendId(), "You have been blocked by " + key.getUserId(), EventNameSend.blockFriend);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean unblockFriend(FriendKey key) {
        int result1 = friendMapper.unblockFriendFirstStep(key);
        int result2 = friendMapper.unblockFriendSecondStep(key);
        if (result1 > 0 && result2 > 0) {
            // 通知对方
            socketIOService.pushMessageToUser(key.getFriendId(), "You have been unblocked by " + key.getUserId(), EventNameSend.unblockFriend);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean deleteFriend(FriendKey key) {
        int result = friendMapper.deleteFriend(key);
        if (result > 0) {
            // 通知对方
            socketIOService.pushMessageToUser(key.getFriendId(), "You have been removed from friends by " + key.getUserId(), EventNameSend.deleteFriend);
            return true;
        }
        return result > 0;
    }
}
