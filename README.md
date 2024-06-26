# Qwitter 移动聊天应用程序

欢迎访问 Qwitter 移动聊天应用程序的 GitHub 仓库！本 README 提供了项目的概述，包括安装说明、项目结构和贡献指南。

## 项目概述

Qwitter 是一个跨平台的移动聊天应用程序，前端使用 React Native 开发，后端使用 Spring Boot 开发。该应用程序支持实时消息传递、文件传输、群聊和通知，提供了在 Android 和 iOS 设备上无缝的通信体验。

## 目录

1. [项目概述](#项目概述)
2. [功能](#功能)
3. [技术栈](#技术栈)
4. [安装](#安装)
5. [使用](#使用)
6. [项目结构](#项目结构)
7. [贡献](#贡献)

## 功能

- 用户注册和认证
- 端到端加密的实时消息传递
- 好友和群组管理
- 文件传输（图片、视频、文档）
- 推送通知
- 用户资料自定义

## 技术栈

**客户端：**
- React Native
- TypeScript
- SQLite

**服务端：**
- Spring Boot
- MyBatis
- MySQL

**实时通信：**
- Socket.IO

**安全：**
- Spring Security
- JWT

**推送通知：**
- Notifee

## 安装

### 前置条件

- Node.js
- Java 开发工具包 (JDK)
- Android Studio / VS Code
- MySQL 服务器

### 后端安装

1. 克隆仓库：
   ```sh
   git clone https://github.com/lhf-hub/chatApp/server.git
   ```
2. 在 application.properties 中配置数据库连接：
	 ```sh
	 spring.datasource.url=jdbc:mysql://localhost:3306/chatApp
	 spring.datasource.username=root
	 spring.datasource.password=yourpassword
   ```
3. 构建并运行后端：
	 ```sh
   ./mvnw spring-boot:run
   ```
### 前端安装
1. 克隆仓库：
	 ```sh
	 git clone https://github.com/lhf-hub/chatApp/client.git
   ```
2. 安装依赖：
   ```sh
	 npm install
3. 启动应用程序：
   ```sh
	 npx react-native run-android # Android
	 npx react-native run-ios # iOS
	 npm run android # ios
   ```
### 使用
1. 注册新用户账户（邮箱）。
2. 使用您的凭据登录。
3. 添加好友并创建群组。
4. 开始实时聊天并分享文件。
5. 自定义您的个人资料并管理设置。

### 我们欢迎社区的贡献！要贡献：

1. Fork 此仓库。
2. 创建一个新分支 (git checkout -b feature/your-feature)。
3. 进行您的更改并提交 (git commit -m 'Add new feature')。
4. 推送到分支 (git push origin feature/your-feature)。
5. 创建一个拉取请求。
6. 请确保您的代码遵循项目的编码标准，并包含适当的测试。
