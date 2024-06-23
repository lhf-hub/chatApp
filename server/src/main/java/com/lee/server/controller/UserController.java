package com.lee.server.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.lee.server.common.email.EmailSender;
import com.lee.server.common.email.VerificationCodeService;
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
@RequestMapping("")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private FriendService friendService;

    @Autowired
    VerificationCodeService verificationCodeService;

    @PostMapping("/sendVerificationCode/{id}")
    public ApiResponse<Void> sendVerificationCode(@PathVariable String id) {
//        String toEmail = map.get("id");
        System.out.println("toEmail: " + id);
        return EmailSender.sendEmail(id) ? ApiResponse.success() : ApiResponse.fail(501, "Please do not send code repeatedly");
    }
    @PostMapping("/register")
    public ApiResponse<Void> register(@RequestBody Map<String, String> map) {
        String id = map.get("id");
        String verificationCode = map.get("verificationCode");
        String password = map.get("password");
        System.out.println("id: " + id);
        System.out.println("verificationCode: " + verificationCode);
        if (!verificationCodeService.validateCode(id, verificationCode)) {
            return ApiResponse.fail(501, "Verification code error");
        }
        return userService.register(id, password) > 0 ? ApiResponse.success() : ApiResponse.fail(501, "Register failed");
    }
    @GetMapping("/login/{id}/{password}")
    public ApiResponse<String> login(@PathVariable String id, @PathVariable String password) {
        User loginedUser = userService.login(id, password);
        if(loginedUser == null) {
            return ApiResponse.usernameOrPasswordError();
        }
        else {
            // 将账号密码存进token
            String tokenSecret = "lhf20040208";
            String token = JWT.create()
                    .withClaim("id", id)
                    .withClaim("password", password).sign(Algorithm.HMAC256(tokenSecret));
            return ApiResponse.success(token);
        }
    }

    @GetMapping("/user/{id}")
    public ApiResponse<User> getUserById(@PathVariable String id) {
        return ApiResponse.success(userService.findById(id));
    }

    @GetMapping("/user/nameOrId/{id}/{nameOrId}")
    public ApiResponse<List<Object>> getUserByNameOrId(@PathVariable String id, @PathVariable String nameOrId) {
        List<User> users = new ArrayList<>(userService.findByName(nameOrId));
        User user = userService.findById(nameOrId);
        if (user != null && !users.contains(user)) {
            users.add(user);
        }
        if (users.isEmpty()) {
            return ApiResponse.fail(501, "No result found");
        }
        List<Object> userMap = new ArrayList<>();
        for (User u : users) {
            String tem = friendService.findByPrimaryKey(new FriendKey(id, u.getId())) != null
                    ? friendService.findByPrimaryKey(new FriendKey(id, u.getId())).getStatus() : "";
            String status = "";
            if(u.getId().equals(id))
                status = "self";
            else if(tem.equals("accepted"))
                status = "accepted";
            else if(tem.equals("pendingSend"))
                status = "pendingSend";
            else if(tem.equals("pendingReceive"))
                status = "pendingReceive";
            else if(tem.equals("rejectedSend"))
                status = "rejectedSend";
            else if(tem.equals("rejectedReceive"))
                status = "rejectedReceive";
            else if(tem.equals("blockedSend"))
                status = "blockedSend";
            else if(tem.equals("blockedReceive"))
                status = "blockedReceive";
            else
                status = "stranger";
            String finalStatus = status;
            userMap.add(new HashMap<String, String>(){
                {
                put("id", u.getId());
                put("name", u.getName());
                if (u.getProfilePicture() != null)
                    put("profilePicture", Base64.getEncoder().encodeToString(u.getProfilePicture()));
                else
                    put("profilePicture", "");
                if (u.getCreatedAt() != null)
                    put("createdAt", u.getCreatedAt().toString().substring(0, 19));
                else
                    put("createdAt", "");
                put("status", finalStatus);
                }
            });
        }
        return ApiResponse.success(userMap);
    }

    @GetMapping("/user")
    public ApiResponse<List<User>> getAllUsers() {
        return ApiResponse.success(userService.findAll());
    }

    @PutMapping("/user/{id}")
    public ApiResponse<Void> updateUser(@PathVariable String id, @RequestBody User user) {
        try {
            // 设置用户ID
            user.setId(id);

            // 更新用户信息
            userService.update(user);

            // 返回成功响应
            return ApiResponse.success();
        } catch (Exception e) {
            System.out.println(e.getMessage()+"\n"+ Arrays.toString(e.getStackTrace()));
            // 处理异常并返回错误响应
            return ApiResponse.fail(500, e.getMessage());
        }
    }

    @DeleteMapping("/user/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable String id) {
        try {
            // 删除用户
            userService.delete(id);
            // 返回成功响应
            return ApiResponse.success();
        } catch (Exception e) {
            // 处理异常并返回错误响应
            return ApiResponse.fail(500, e.getMessage());
        }
    }



}
