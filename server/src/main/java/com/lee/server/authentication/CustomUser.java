package com.lee.server.authentication;
import com.lee.server.pojo.User;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;

/**
 * 自定义对象
 */
public class CustomUser extends org.springframework.security.core.userdetails.User {
    // 该类实现了UserDetails接口省去了重写方法的工作
    private User user;

    public CustomUser(User user, Collection<? extends GrantedAuthority> authorities) {
        // 此函数目的是为了将User对象转换为UserDetails对象
        super(user.getId(), user.getPassword(), authorities);
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}


