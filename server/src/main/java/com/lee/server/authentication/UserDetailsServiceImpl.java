package com.lee.server.authentication;

import com.lee.server.pojo.User;
import com.lee.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Collections;
import java.util.Objects;

/**
 * 实现UserDetailsService接口，重写方法
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserService userService;
    @Autowired
    public UserDetailsServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        User user = userService.findById(id);
        if (Objects.isNull(user)){
            throw new UsernameNotFoundException("用户名不存在！");
        }

//        if(user.getStatus() == 0) {
//            throw new RuntimeException("账号已停用");
//        }
        return new CustomUser(user, Collections.emptyList());
    }
}
