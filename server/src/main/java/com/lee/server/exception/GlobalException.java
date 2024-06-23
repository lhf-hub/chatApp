package com.lee.server.exception;

import com.lee.server.common.responseBodyCustom.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.ClientAbortException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(ClientAbortException.class)
    public void handleClientAbortException(ClientAbortException e) {
        // 不记录堆栈信息，只记录一个警告日志
        log.warn("Client aborted the connection: {}", e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse<Void> exception(Exception e) {
        log.error("全局异常信息 ex={}", e.getMessage(), e);
        return ApiResponse.error();
    }

    @ExceptionHandler(CustomException.class)
    public ApiResponse<Void> customExceptionHandler(CustomException e) {
        return ApiResponse.fail(e.getCode(), e.getMessage());
    }
}
