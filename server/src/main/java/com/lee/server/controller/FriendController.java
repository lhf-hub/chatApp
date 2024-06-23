package com.lee.server.controller;

import com.lee.server.common.responseBodyCustom.ApiResponse;
import com.lee.server.pojo.Friend;
import com.lee.server.pojo.FriendKey;
import com.lee.server.pojo.User;
import com.lee.server.service.FriendService;
import com.lee.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/friend")
public class FriendController {
    @Autowired
    FriendService friendService;

    @Autowired
    UserService userService;

    @GetMapping("/{userId}")
    public ApiResponse<List<Object>> findByUserId(@PathVariable String userId) {
        List<Friend> friends = friendService.findByUserId(userId);
        return getUsersByFriends(friends);
    }

    @GetMapping("/{userId}/{friendId}")
    public ApiResponse<User> findByPrimaryKey(@PathVariable String userId, @PathVariable String friendId) {
        Friend friend = friendService.findByPrimaryKey(new FriendKey(userId, friendId));
        if (friend == null) {
            return ApiResponse.fail(501, "No such friend");
        }
        User user = userService.findById(friendId);
        if (user == null) {
            return ApiResponse.fail(501, "No such user");
        }
        return ApiResponse.success(user);
    }

    private ApiResponse<List<Object>> getUsersByFriends(List<Friend> friends) {
        if (friends.isEmpty()) {
            return ApiResponse.fail(501, "No friends");
        }
        List<Object> users = new ArrayList<>();
        for (Friend friend : friends) {
            if(friend.getKey() == null) {
                continue;
            }
            User user = userService.findById(friend.getKey().getFriendId());
            if (user != null) {
                users.add(new HashMap<String, String>() {{
                    put("id", user.getId());
                    put("name", user.getName());
                    if (user.getProfilePicture() != null)
                        put("profilePicture", Base64.getEncoder().encodeToString(user.getProfilePicture()));
                    else
                        put("profilePicture", "");
                    if (user.getCreatedAt() != null)
                        put("createdAt", user.getCreatedAt().toString().substring(0, 19));
                    else
                        put("createdAt", "");
                    put("status", friend.getStatus());
                }});
            }
        }
        if (users.isEmpty()) {
            return ApiResponse.fail(501, "No such users");
        }
        return ApiResponse.success(users);
    }

    @GetMapping("/nameOrFriendId/{userId}/{nameOrFriendId}")
    public ApiResponse<List<Object>> findByNameOrFriendId( @PathVariable String userId, @PathVariable String nameOrFriendId) {
        List<Friend> friends = friendService.findByNameOrFriendId(userId, nameOrFriendId);
        return getUsersByFriends(friends);
    }

    @GetMapping("/canAccept/{userId}")
    public ApiResponse<List<User>> findCanAccept(@PathVariable String userId) {
        List<Friend> friends = friendService.findCanAccept(userId);
        if(friends.isEmpty()) {
            return ApiResponse.fail(501, "No friends to accept");
        }
        List<User> users = new ArrayList<>();
        for (Friend friend : friends) {
            if(friend.getKey() == null) {
                continue;
            }
            User user = userService.findById(friend.getKey().getUserId());
            if (user != null)
                users.add(user);
        }
        if (users.isEmpty()) {
            return ApiResponse.fail(501, "No such users");
        }
        return ApiResponse.success(users);
    }

    @PostMapping
    public ApiResponse<Void> addFriend(@RequestBody Map<String, String> map) {
        String userId = map.get("userId");
        String friendId = map.get("friendId");
        if (friendService.addFriend(new FriendKey(userId, friendId))) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Add friend failed");
    }

    @PutMapping("/accept")
    public ApiResponse<Void> acceptFriend(@RequestBody Map<String, String> map) {
        String userId = map.get("userId");
        String friendId = map.get("friendId");
        if (friendService.acceptFriend(new FriendKey(userId, friendId))) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Accept friend failed");
    }

    @PutMapping("/reject")
    public ApiResponse<Void> rejectFriend(@RequestBody Map<String, String> map) {
        String userId = map.get("userId");
        String friendId = map.get("friendId");
        if (friendService.rejectFriend(new FriendKey(userId, friendId))) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Reject friend failed");
    }

    @PutMapping("/block")
    public ApiResponse<Void> blockFriend(@RequestBody Map<String, String> map) {
        String userId = map.get("userId");
        String friendId = map.get("friendId");
        if (friendService.blockFriend(new FriendKey(userId, friendId))) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Block friend failed");
    }

    @PutMapping("/unblock")
    public ApiResponse<Void> unblockFriend(@RequestBody Map<String, String> map) {
        String userId = map.get("userId");
        String friendId = map.get("friendId");
        if (friendService.unblockFriend(new FriendKey(userId, friendId))) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Unblock friend failed");
    }

    @DeleteMapping("/{userId}/{friendId}")
    public ApiResponse<Void> deleteFriend(@PathVariable String userId, @PathVariable String friendId) {
        if (friendService.deleteFriend(new FriendKey(userId, friendId))) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Delete friend failed");
    }


}
