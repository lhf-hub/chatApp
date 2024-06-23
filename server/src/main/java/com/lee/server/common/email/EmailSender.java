package com.lee.server.common.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

@Component
public class EmailSender {
    private static VerificationCodeService verificationCodeService;
    private static final String HOST = "smtp.163.com";
    private static final String PORT = "465"; // SSL端口号
    private static final String USERNAME = "qwitter@163.com"; // 邮箱地址
    private static final String PASSWORD = "WFHLMWZTOUQOERNI"; // 授权码
    private static final long TIMEOUT = TimeUnit.MINUTES.toMillis(1);

    private static ConcurrentMap<String, Long> lastSentMap = new ConcurrentHashMap<>();
    public static String subject = "Qwitter 验证码";


    public EmailSender(VerificationCodeService verificationCodeService) {
        EmailSender.verificationCodeService = verificationCodeService;
    }


    public static boolean canSendCode(String email) {
        long currentTime = System.currentTimeMillis();
        Long lastSentTime = lastSentMap.get(email);

        if (lastSentTime == null || (currentTime - lastSentTime) > TIMEOUT) {
            lastSentMap.put(email, currentTime);
            return true;
        }
        return false;
    }
    public static boolean sendEmail(String toEmail) { // 收件人邮箱、主题和内容
//        final String username = "qwitter208@gmail.com"; // 邮箱
//        final String password = "pswb zkfm cege remg"; // 应用专用密码
        System.out.println("sendEmail: " + toEmail);

        if (canSendCode(toEmail)){
            System.out.println("canSendCode");
            String code = verificationCodeService.generateCode(toEmail);
            System.out.println("code: " + code);

            String subject = code + "请确认您的 Qwitter 验证码";
            String content =
                    "<p><b style=\"font-size: 1.5em;\">确认你的邮件地址</b></p>" +
                            "<p>在创建 Qwitter 账号之前，您需要完成一个简单的步骤。让我们确保这是正确的邮件地址 — 请确认这是用于您的新账号的正确地址。</p>" +
                            "<p>请输入此验证码以开始使用：</p>" +
                            "<p><b style=\"font-size: 2em;\">" + code + "</b></p>" +
                            "<p>验证码将于两小时后过期。</p>" +
                            "<p>谢谢。  From Qwitter</p>";

            Properties prop = new Properties();
            prop.put("mail.smtp.host", HOST);
            prop.put("mail.smtp.port", PORT);
            prop.put("mail.smtp.auth", "true");
            prop.put("mail.smtp.ssl.enable", "true");
            prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

            Session session = Session.getInstance(prop, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(USERNAME, PASSWORD);
                }
            });

            // 异步发送邮件
            CompletableFuture.runAsync(() -> {
                try {
                    Message message = new MimeMessage(session);  // 创建邮件对象
                    message.setFrom(new InternetAddress(USERNAME)); // 设置发件人
                    message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail)); // 设置收件人
                    message.setSubject(subject); // 设置邮件主题

                    // 设置邮件内容类型为HTML
                    message.setContent(content, "text/html; charset=utf-8");
                    Transport.send(message); // 发送邮件
                    System.out.println("邮件发送成功");
                } catch (MessagingException e) {
                    e.printStackTrace();
                }
            });
            return true;

        }
        return false;
    }
}
