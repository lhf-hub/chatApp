package com.lee.server.socket.impl;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.lee.server.mapper.GroupMemberMapper;
import com.lee.server.mapper.MessageMapper;
import com.lee.server.pojo.Message;
import com.lee.server.pojo.Notification;
import com.lee.server.socket.SocketIOService;
import com.lee.server.socket.event.EventNameSend;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;



@Slf4j
@Service("socketIOService")
public class SocketIOServiceImpl implements SocketIOService {

    @Lazy
    @Autowired
    private SocketIOServer server;

    @Autowired
    MessageMapper messageMapper;

    @Autowired
    GroupMemberMapper groupMemberMapper;

    private static final int THREAD_POOL_SIZE = 10; // 自定义线程池大小
    private final ExecutorService executorService = Executors.newFixedThreadPool(THREAD_POOL_SIZE);

    private static final Map<String, SocketIOClient> clientMap = new ConcurrentHashMap<>();
    private static final Map<String, List<SocketIOClient>> groupClientMap = new ConcurrentHashMap<>();

    @PostConstruct
    private void autoStartup() {
        start();
    }

    @PreDestroy
    private void autoStop() {
        stop();
    }

    @Override
    public void start() {
        // 监听客户端连接
        server.addConnectListener(client -> {
            log.debug("************ 客户端： " + getIpByClient(client) + " 已连接 ************");
            // 自定义事件`connected` -> 与客户端通信  （也可以使用内置事件，如：Socket.EVENT_CONNECT）
            client.sendEvent(EventNameSend.connectSuccess, "你成功连接上了哦...");
            String userId = getParamsByClient(client);
            System.out.println("groupClientMap: " + groupClientMap);
            System.out.println("userId: " + userId);
            if (userId != null) {
                clientMap.put(userId, client);
                // 加入用户所属的群组
                List<String> groupIds = groupMemberMapper.getGroupIdsByUserId(userId);
                for (String groupId : groupIds) {
                    addClientToGroup(groupId, client);
                }
                sendOfflineMessages(userId);
                System.out.println("clientMap: " + clientMap);
                System.out.println("groupClientMap: " + groupClientMap);
            }
        });

        // 监听客户端断开连接
        server.addDisconnectListener(client -> {
            String clientIp = getIpByClient(client);
            log.debug(clientIp + " *********************** " + "客户端已断开连接");
            String userId = getParamsByClient(client);
            if (userId != null) {
                clientMap.remove(userId);
                // 移除用户从群组
                List<String> groupIds = groupMemberMapper.getGroupIdsByUserId(userId);
                for (String groupId : groupIds) {
                    removeClientFromGroup(groupId, client);
                }
                client.disconnect();
            }
        });
        // 启动服务
        server.start();
        // broadcast: 默认是向所有的socket连接进行广播，但是不包括发送者自身，如果自己也打算接收消息的话，需要给自己单独发送。
    }

    @Override
    public void stop() {
        if (server != null) {
            server.stop();
            server = null;
        }
    }

    @Override
    public void pushMessageToUser(String userId, Object msgContent, String event) {
        CompletableFuture.runAsync(() -> {
            SocketIOClient client = clientMap.get(userId);
            if (client != null) {
                client.sendEvent(event, msgContent);
            }
        }, executorService).exceptionally(ex -> {
            log.error("Error pushing message to user: {}", userId, ex);
            return null;
        });
    }

    @Override
    public void pushMessageToGroup(String groupId, Object msgContent, String event, String senderId) {
//        CompletableFuture.runAsync(() -> {
            List<SocketIOClient> clients = groupClientMap.get(groupId);
            if (clients != null) {
                int i = 0;
                for (SocketIOClient client : clients) {
                    System.out.println(i++);
                    if (client.equals(clientMap.get(senderId)) || !client.isChannelOpen()){
                        System.out.println("我走了");
                        continue;
                    }
                    if (client.isChannelOpen()) {
                        System.out.println("client: " + client + " ####我发消息了###" + " event: " + event);
                        client.sendEvent(event, msgContent);
                        client.sendEvent(EventNameSend.receiveGroupMessageNotification, new Notification(
                                ((Message) msgContent).getSenderId(),
                                ((Message) msgContent).getGroupId(),
                                "You have a new groupMessage",
                                ((Message) msgContent).getContent(),
                                ((Message) msgContent).getMessageType(),
                                ((Message) msgContent).getCreatedAt().substring(5, 16)
                        ));
                    } else {
                        messageMapper.save((Message) msgContent);
                    }
                }
            }
//        }, executorService).exceptionally(ex -> {
//            log.error("Error pushing message to group: {}", groupId, ex);
//            return null;
//        });
    }

    @PreDestroy
    private void shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
                if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                    log.error("Thread pool did not terminate");
                }
            }
        } catch (InterruptedException ie) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    public boolean isUserOnline(String userId) {
        return clientMap.containsKey(userId);
    }

    private void sendOfflineMessages(String userId) {
        List<Message> offlineMessages = messageMapper.findAllByReceiverId(userId);
        System.out.println("offlineMessages: " + offlineMessages);

        if (offlineMessages == null) {
            return;
        }
        for (Message message : offlineMessages) {
            CompletableFuture.runAsync(() -> {
                System.out.println("offlineMessage: " + message + " uidyykduityidisyiyi");
                try {
                    // 推送消息到用户
                    pushMessageToUser(userId, message, EventNameSend.receiveMessage);
                    // 消息推送通知
                    pushMessageToUser(userId, new Notification(
                            message.getSenderId(),
                            message.getReceiverId(),
                            "You have a new message",
                            message.getContent(),
                            message.getMessageType(),
                            message.getCreatedAt().substring(5, 16)
                    ), EventNameSend.receiveMessageNotification);
                    System.out.println("Message sent to user: " + userId);
                } catch (Exception e) {
                    System.err.println("Unexpected error: " + e.getMessage());
                }
            }).exceptionally(ex -> {
                System.err.println("Async execution failed: " + ex.getMessage());
                return null;
            });
        }
        messageMapper.deleteAllByReceiverId(userId);
    }

    // 添加用户到群组
    public void addClientToGroup(String groupId, SocketIOClient client) {
        groupClientMap.computeIfAbsent(groupId, k -> new ArrayList<>())
                .stream()
                .filter(existingClient -> existingClient.getSessionId().equals(client.getSessionId()))
                .findFirst()
                .ifPresentOrElse(
                        existingClient -> { /* Client already in group, do nothing */ },
                        () -> groupClientMap.get(groupId).add(client)
                );
    }

    // 移除用户从群组
    public void removeClientFromGroup(String groupId, SocketIOClient client) {
        List<SocketIOClient> clients = groupClientMap.get(groupId);
        if (clients != null) {
            clients.remove(client);
            if (clients.isEmpty()) {
                groupClientMap.remove(groupId);
            }
        }
    }

    private String getParamsByClient(SocketIOClient client) {
        // 获取客户端url参数（这里的userId是唯一标识）
        Map<String, List<String>> params = client.getHandshakeData().getUrlParams();
        List<String> userIdList = params.get("userId");
        if (!CollectionUtils.isEmpty(userIdList)) {
            return userIdList.get(0);
        }
        return null;
    }

    private String getIpByClient(SocketIOClient client) {
        String sa = client.getRemoteAddress().toString();
        return sa.substring(1, sa.indexOf(":"));
    }

    public static SocketIOClient getClient(String userId) {
        return clientMap.get(userId);
    }
}
