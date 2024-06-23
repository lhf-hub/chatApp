package com.lee.server.mapper;

import com.lee.server.pojo.Friend;
import com.lee.server.pojo.FriendKey;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FriendMapper {

    Friend findByPrimaryKey(FriendKey key); // 查找自己的某一位好友

    List<Friend> findByUserId(String userId); // 查找自己的所有好友，只需要userId

    List<Friend> findByNameOrFriendId(String userId, String nameOrFriendId);

    List<Friend> findCanAccept(String userId); // 只需要userId 查找状态为pendingReceive的记录 - 可接受好友请求

    Integer insert(String userId, String friendId, String status); // 插入一条记录

    Integer update(String userId, String friendId, String status); // 更新一条记录

    Integer addFriend(FriendKey key); // 为自己添加好友，并修改状态至pendingSend
    Integer addFriendReverse(FriendKey key); // 为对方添加好友，并修改状态至pendingReceive


    // pendingReceive状态时才能接受好友请求，接受后修改该条状态至accepted
    // 同时修改反向记录的状态pendingSend至accepted
    Integer acceptFriendFirstStep(FriendKey key); // 接受好友请求 - 第一步
    Integer acceptFriendSecondStep(FriendKey key); // 接受好友请求 - 第二步

    // pendingReceive状态时才能拒绝好友请求，拒绝后修改该条状态至rejectedSend 表示已拒绝
    // 同时修改反向记录的状态至rejectedReceive 表示被拒绝
    Integer rejectFriendFirstStep(FriendKey key); // 拒绝好友请求 - 第一步
    Integer rejectFriendSecondStep(FriendKey key); // 拒绝好友请求 - 第二步

    // 好友状态为accepted时才能拉黑好友，拉黑后修改状态至blockedSend
    // 同时修改反向记录的状态至blockedReceive
    Integer blockFriendFirstStep(FriendKey key); // 拉黑好友 - 第一步
    Integer blockFriendSecondStep(FriendKey key); // 拉黑好友 - 第二步

    // 只有状态为blockedSend时 才能解除拉黑好友，解除拉黑后修改状态至accepted
    // 同时修改反向记录的状态至accepted
    Integer unblockFriendFirstStep(FriendKey key); // 解除拉黑好友 - 第一步
    Integer unblockFriendSecondStep(FriendKey key); // 解除拉黑好友 - 第二步

    Integer deleteFriend(FriendKey key); // 只有状态为accepted 或 blocked时 才能删除好友，删除自己与某位好友的所有记录，包括反向记录
}


