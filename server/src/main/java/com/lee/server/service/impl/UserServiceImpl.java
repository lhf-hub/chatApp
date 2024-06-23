package com.lee.server.service.impl;

import com.lee.server.mapper.UserMapper;
import com.lee.server.pojo.User;
import com.lee.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // 交给Spring容器管理
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    @Autowired
    public UserServiceImpl(UserMapper userMapper, @Lazy AuthenticationManager authenticationManager) {
        this.userMapper = userMapper;
    }

    @Override
    public Integer register(String id, String password) {
        return userMapper.register(id, password);
    }

    @Override
    public User login(String id, String password) {
        return userMapper.login(id, password);
    }

    @Override
    public List<User> findAll() {
        return userMapper.findAll();
    }

    @Override
    public User findById(String id) {
        return userMapper.findById(id);
    }

    @Override
    public List<User> findByName(String name) {
        return userMapper.findByName(name);
    }

    @Override
    public void update(User user) {
        userMapper.update(user);
    }

    @Override
    public void delete(String id) {
        userMapper.delete(id);
    }
}
