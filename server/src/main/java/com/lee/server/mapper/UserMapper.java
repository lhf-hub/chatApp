package com.lee.server.mapper;

import com.lee.server.pojo.User;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;


@Mapper // MyBatis的注解，表示这是一个Mapper类
//@Repository // Spring的注解，表示这是一个Bean, 并交给Spring容器管理
public interface UserMapper {

    Integer register(@Param("id") String id, @Param("password") String password);
    User login(@Param("id") String id, @Param("password") String password);
    List<User> findAll();

    User findById(@Param("id") String id);

    List<User> findByName(@Param("name") String name);


    void update(User user);

    void delete(@Param("id") String id);

}
