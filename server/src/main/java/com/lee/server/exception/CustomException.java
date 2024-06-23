package com.lee.server.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomException extends RuntimeException{
    protected Integer code;
    protected String message;

    public CustomException(Integer code,String message,Throwable e) {
        super(message,e);
        this.code = code;
        this.message = message;
    }

}

