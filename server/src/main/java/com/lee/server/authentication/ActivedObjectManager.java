package com.lee.server.authentication;

import org.springframework.stereotype.Component;

import java.util.HashMap;


@Component
public class ActivedObjectManager {
    private HashMap<String, Object> objects;

    public ActivedObjectManager() {
        this.objects = new HashMap<String, Object>();
    }

    public void addObject(String key, Object object) {
        this.objects.put(key, object);
    }


    public <T> T getObject(String key) {
        return (T) this.objects.get(key);
    }

    public void removeObject(String key) {
        this.objects.remove(key);
    }
}
