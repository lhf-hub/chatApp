package com.lee.server.service;

import com.lee.server.pojo.Friend;
import com.lee.server.pojo.FriendKey;

import java.util.List;

public interface FriendService {
    Friend findByPrimaryKey(FriendKey key);

    List<Friend> findByUserId(String userId);

    List<Friend> findByNameOrFriendId(String userId, String nameOrFriendId);

    List<Friend> findCanAccept(String userId);

    boolean addFriend(FriendKey key);

    boolean acceptFriend(FriendKey key);

    boolean rejectFriend(FriendKey key);

    boolean blockFriend(FriendKey key);

    boolean unblockFriend(FriendKey key);

    boolean deleteFriend(FriendKey key);
}

