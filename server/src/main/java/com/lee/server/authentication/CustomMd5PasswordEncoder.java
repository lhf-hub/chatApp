package com.lee.server.authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;

import java.util.Arrays;

/**
 * 自定义security密码校验
 */
public class CustomMd5PasswordEncoder implements PasswordEncoder {
    @Override
    public String encode(CharSequence rawPassword) {
        // 进行一个md5加密
        return Arrays.toString(DigestUtils.md5Digest(rawPassword.toString().getBytes()));
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        // 通过md5校验
        return encodedPassword.equals(Arrays.toString(DigestUtils.md5Digest(rawPassword.toString().getBytes())));
    }
}


