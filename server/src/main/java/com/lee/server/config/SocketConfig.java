package com.lee.server.config;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import com.lee.server.socket.event.CustomEventRegistrar;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;

@org.springframework.context.annotation.Configuration
public class SocketConfig {
    @Lazy
    @Bean
    public SocketIOServer socketIOServer(CustomEventRegistrar registrar) {
        Configuration config = new Configuration();
        config.setHostname("0.0.0.0");
        config.setPort(3000);
        // 设置最大帧长度，单位为字节
        config.setMaxFramePayloadLength(20 * 1024 * 1024); // 1MB
        config.setOrigin("*");
        SocketIOServer server = new SocketIOServer(config);
        for (String key : registrar.getEventHandlers().keySet()) {
            DataListener listener = null;
            try {
                listener = registrar.getEventHandlers().get(key);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            server.addEventListener(key, String.class, listener);
        }
        return server;
    }
}
