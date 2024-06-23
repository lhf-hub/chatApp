package com.lee.server.socket.event;
import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

@Getter
@Component
public class CustomEventRegistrar {

    private final Map<String, DataListener> eventHandlers = new HashMap<>();

    @Autowired
    public CustomEventRegistrar(ApplicationContext context) {
        Map<String, Object> beansWithAnnotation = context.getBeansWithAnnotation(CustomEvents.class);
        for (Object handler : beansWithAnnotation.values()) {
            Method[] methods = handler.getClass().getMethods();
            for (Method method : methods) {
                if (method.isAnnotationPresent(CustomEvent.class)) {
                    CustomEvent eventHandler = method.getAnnotation(CustomEvent.class);
                    String eventName = eventHandler.value();
                    Parameter[] methodParameters = method.getParameters();

                    // 类型检查
                    if (methodParameters.length != 3) {
                        throw new IllegalArgumentException("方法必须包含3个参数");
                    }
                    if(methodParameters[0].getType() != SocketIOClient.class) {
                        throw new IllegalArgumentException("第一个参数必须是SocketIOClient类型");
                    }

                    // 必须是object及其子类
                    if(!Object.class.isAssignableFrom(methodParameters[1].getType())) {
                        throw new IllegalArgumentException("第二个参数必须是Object类型");
                    }

                    if(methodParameters[2].getType() != AckRequest.class) {
                        throw new IllegalArgumentException("第三个参数必须是AckRequest类型");
                    }

                    Type type = methodParameters[1].getType();

                    if (!eventName.isEmpty()) {
                        eventHandlers.put(eventName, (client, data, ackRequest) -> {
                            method.invoke(handler, client, data, ackRequest);
                        });
                    }
                }
            }
        }
    }
}

