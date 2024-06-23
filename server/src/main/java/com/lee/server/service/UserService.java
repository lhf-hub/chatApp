package com.lee.server.service;

import com.lee.server.pojo.User;

import java.util.List;

public interface UserService {
    Integer register(String id, String password);

    User login(String id, String password);
    List<User> findAll();
    User findById(String id);

    List<User> findByName(String name);


    void update(User user);

    void delete(String id);
}

