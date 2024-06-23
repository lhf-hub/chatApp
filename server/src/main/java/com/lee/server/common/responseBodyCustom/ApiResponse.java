package com.lee.server.common.responseBodyCustom;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> implements Serializable {

    private static final long serialVersionUID = 1L;
    private Integer code;
    private String msg;
    private T data;

    public ApiResponse(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }
    public ApiResponse(Integer code, T data) {
        this.code = code;
        this.data = data;
    }

    public static <T> ApiResponse<T> fail(Integer code, String msg) { // 失败，自定义错误码和错误信息
        return new ApiResponse<>(code, msg);
    }

    public static <T> ApiResponse<T> success() { // 插入删除更新等成功   200
        return new ApiResponse<>(ResponseCode.SUCCESS.getCode(), ResponseCode.SUCCESS.getMsg());
    }
    public static <T> ApiResponse<T> success(T data) { // 查询成功 200
        return new ApiResponse<>(ResponseCode.SUCCESS.getCode(), ResponseCode.SUCCESS.getMsg(), data);
    }

    public static <T> ApiResponse<T> error() { // 失败，服务器错误 500
        return new ApiResponse<>(ResponseCode.ERROR.getCode(), ResponseCode.ERROR.getMsg());
    }

    public static <T> ApiResponse<T> error(String msg) { // 失败，自定义错误信息 500
        return new ApiResponse<>(ResponseCode.ERROR.getCode(), msg);
    }

    public static <T> ApiResponse<T> authError() { // 权限不足 402
        return new ApiResponse<>(ResponseCode.ACCESS_DENIED.getCode(), ResponseCode.ACCESS_DENIED.getMsg());
    }

    public static <T> ApiResponse<T> invalidToken() { // 无效token 401
        return new ApiResponse<>(ResponseCode.INVALID_TOKEN.getCode(), ResponseCode.INVALID_TOKEN.getMsg());
    }

    public static <T> ApiResponse<T> usernameOrPasswordError() { // 用户名或密码错误    403
        return new ApiResponse<>(ResponseCode.USERNAME_OR_PASSWORD_ERROR.getCode(), ResponseCode.USERNAME_OR_PASSWORD_ERROR.getMsg());
    }

}
