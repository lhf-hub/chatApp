package com.lee.server.controller;

import com.lee.server.common.responseBodyCustom.ApiResponse;
import com.lee.server.mapper.UserMapper;
import com.lee.server.pojo.Group;
import com.lee.server.pojo.GroupMember;
import com.lee.server.pojo.User;
import com.lee.server.service.GroupService;
import com.lee.server.service.GroupMemberService;
import com.lee.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/group")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private GroupMemberService groupMemberService;

    @Autowired
    private UserService userService;


    @GetMapping("/owned/{userId}")
    public ApiResponse<List<Object>> findGroupsByOwnerId(@PathVariable String userId) {
        if (userId == null) {
            return ApiResponse.fail(501, "No such user");
        }
        List<Group> groups = groupService.findGroupsByOwnerId(userId);
        return groupsToObjects(groups);
    }

    @GetMapping("/joined/{userId}")
    public ApiResponse<List<Object>> findGroupsByMemberId(@PathVariable String userId) {
        if (userId == null) {
            return ApiResponse.fail(501, "No such user");
        }
        List<Group> groups = groupService.findGroupsByMemberId(userId);
        return groupsToObjects(groups);
    }

    private ApiResponse<List<Object>> groupsToObjects(List<Group> groups) {
        if (groups.isEmpty()) {
            return ApiResponse.fail(501, "No groups");
        }
        List<Object> resultGroups = new ArrayList<>();
        for (Group group : groups) {
            resultGroups.add(groupToObject(group));
        }
        return ApiResponse.success(resultGroups);
    }

    private Object groupToObject(Group group) {
        return new HashMap<String, String>(){{
            put("id", group.getId());
            put("name", group.getName());
            put("ownerId", group.getOwnerId());
            put("profilePicture", group.getProfilePicture() == null ? "" : Base64.getEncoder().encodeToString(group.getProfilePicture()));
            put("description", group.getDescription());
            put("createdAt", group.getCreatedAt() == null ? "" : group.getCreatedAt().toString().substring(0, 19));
        }};
    }

    @GetMapping("/{groupId}")
    public ApiResponse<Object> findGroupById(@PathVariable String groupId) {
        Group group = groupService.findGroupById(groupId);
        if (group == null) {
            return ApiResponse.fail(501, "No such group");
        }
        return ApiResponse.success(groupToObject(group));
    }

    @PostMapping("/create")
    public ApiResponse<Void> createGroup(@RequestBody Group group) {
        if (groupService.createGroup(group)) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Create group failed");
    }

    @PutMapping("/update")
    public ApiResponse<Void> updateGroup(@RequestBody Group group) {
        if (groupService.updateGroup(group)) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Update group failed");
    }

    @DeleteMapping("/delete/{groupId}/{ownerId}")
    public ApiResponse<Void> deleteGroup(@PathVariable String groupId, @PathVariable String ownerId) {
        if (groupService.deleteGroup(groupId, ownerId)) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Delete group failed");
    }

    @PostMapping("/member/add")
    public ApiResponse<Void> addGroupMember(@RequestBody GroupMember groupMember) {
        if (groupMemberService.addGroupMember(groupMember)) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Add group member failed");
    }
    // 添加多个群成员，添加群成员后推送消息
    @PostMapping("/member/addMulti")
    public ApiResponse<Void> addGroupMembers(@RequestBody List<GroupMember> groupMembers) {
        if (groupMemberService.addGroupMembers(groupMembers)) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Add group members failed");
    }


    @DeleteMapping("/member/remove/{groupId}/{userId}")
    public ApiResponse<Void> removeGroupMember(@PathVariable String groupId, @PathVariable String userId) {
        if (groupMemberService.removeGroupMember(groupId, userId)) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Remove group member failed");
    }

    @GetMapping("/members/{groupId}")
    // 返回群成员列表，封装user+role
    public ApiResponse<List<Object>> findGroupMembers(@PathVariable String groupId) {
        List<GroupMember> groupMembers = groupMemberService.findGroupMembers(groupId);
        return groupMembersToObjects(groupMembers);
    }

    private ApiResponse<List<Object>> groupMembersToObjects(List<GroupMember> groupMembers) {
        if (groupMembers.isEmpty()) {
            return ApiResponse.fail(501, "No group members");
        }
        List<Object> resultGroupMembers = new ArrayList<>();
        for (GroupMember groupMember : groupMembers) {

            User user = userService.findById(groupMember.getUserId());
            resultGroupMembers.add(new HashMap<String, String>() {
                {
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
                    put("groupId", groupMember.getGroupId());
                    put("role", groupMember.getRole());
                }
            });
        }
        return ApiResponse.success(resultGroupMembers);
    }

    @GetMapping("/members/{groupId}/{nameOrId}")
    public ApiResponse<List<Object>> findGroupMembersByNameOrId(@PathVariable String groupId, @PathVariable String nameOrId) {
        List<GroupMember> groupMembers = groupMemberService.findGroupMembersByNameOrId(groupId, nameOrId);
        return groupMembersToObjects(groupMembers);
    }

    @PutMapping("/owner/{groupId}/{ownerId}/{newOwnerId}")
    public ApiResponse<Void> setGroupNewOwner(@PathVariable String groupId, @PathVariable String ownerId, @PathVariable String newOwnerId) {
        Group group = groupService.findGroupById(groupId);
        if (group == null) {
            return ApiResponse.fail(501, "No such group");
        }
        group.setOwnerId(newOwnerId);
        if (groupMemberService.setGroupNewOwner(groupId, ownerId, newOwnerId) && groupService.updateGroup(group)) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Set new owner failed");
    }

    @PutMapping("/member/exit/{groupId}/{userId}")
    public ApiResponse<Void> exitGroup(@PathVariable String groupId, @PathVariable String userId) {
        if (groupMemberService.exitGroup(groupId, userId)) {
            return ApiResponse.success();
        }
        return ApiResponse.fail(501, "Exit group failed");
    }
}
