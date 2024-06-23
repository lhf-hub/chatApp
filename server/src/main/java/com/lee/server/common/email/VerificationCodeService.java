package com.lee.server.common.email;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import java.util.Random;
import java.util.concurrent.*;


@Service
public class VerificationCodeService {

    private final ConcurrentHashMap<String, String> codeMap = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(20); // 定时任务线程池
    private final int CODE_EXPIRATION_TIME = 1; // 过期时间（分钟）


    public VerificationCodeService() {
        scheduler.scheduleAtFixedRate(this::removeExpiredCodes, CODE_EXPIRATION_TIME, CODE_EXPIRATION_TIME, TimeUnit.MINUTES);
    }


    public String generateCode(String email) {
        String code = generateRandomCode();
        codeMap.put(email, code);
        scheduler.schedule(() -> codeMap.remove(email), CODE_EXPIRATION_TIME, TimeUnit.MINUTES); // 2分钟后过期
        return code;
    }

    public boolean validateCode(String email, String code) {
        String storedCode = codeMap.get(email);
        return storedCode != null && storedCode.equals(code);
    }

    @PreDestroy
    public void destroy() {
        scheduler.shutdown();
    }

    private void removeExpiredCodes() {
        // 这一步不是必须的，因为我们在生成验证码的时候已经安排了定时清除任务
    }

    private String generateRandomCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
