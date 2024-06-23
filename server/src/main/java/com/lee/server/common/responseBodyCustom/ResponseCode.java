package com.lee.server.common.responseBodyCustom;

import lombok.Getter;

@Getter
public enum ResponseCode {

    SUCCESS(200, "success"),

//    服务器错误
    ERROR(500, "server error"),

//    参数异常，资源不存在
    PARAM_ERROR(400, "param error"),
    NOT_FOUND(404, "not found"),

    //    权限相关的错误码
    INVALID_TOKEN(401, "invalid token"),
    ACCESS_DENIED(402, "access denied"),
    //    用户名或密码错误
    USERNAME_OR_PASSWORD_ERROR(403, "username or password error");


    private final int code;

    private final String msg;

    ResponseCode(int code, String msg){
        this.code = code;
        this.msg = msg;
    }
}

