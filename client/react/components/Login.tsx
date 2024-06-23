import { NavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useState } from "react";
import { ColorValue, GestureResponderEvent, PermissionsAndroid, PushNotificationIOS, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { user } from "../api/user";
import { displayNotification } from "../system-notification";
import { io } from "socket.io-client";
import { Message } from "../models/Message";
import { Base64 } from "js-base64";
import { createChat, getChatBy2Id, getDBConnection, getUser, insertMessage, isFriendMuted, isGroupMuted, setUser } from "../SQLite/db-service";



interface LoginProps {
    navigation: StackNavigationProp<any>
}

export default function Login(props: LoginProps) {

    const { context, setContext } = useContext(AppContext);

    const [id, setId] = useState('');

    const [password, setPassword] = useState('');



    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            gap: 50,
            backgroundColor: context.theme.current.background.Normal
        },
        input: {
            width: '80%',
            backgroundColor: context.theme.current.surface.Normal
        },
        button: {
            width: '50%',
        }
    });

    const onLogin = async (e: GestureResponderEvent) => {


        try {
            const res = await user.login(id, password);
            if (res.data.code == 200) {
                const socket = io('http://192.168.5.149:3000', {
                    query: {
                        userId: id,
                    },
                    reconnection: true, // 是否允许自动重连
                    reconnectionAttempts: 5, // 重连尝试的次数
                    reconnectionDelay: 2000, // 初始重连延迟，单位毫秒
                    reconnectionDelayMax: 5000, // 最大重连延迟，单位毫秒
                    randomizationFactor: 0.5 // 用于随机化重连延迟的因子
                })
                socket.on('connect', () => {
                    console.log('connected');

                    socket.on('receiveMessage', async (data: any) => {
                        console.log('收到朋友消息')
                        context.applyEvent('receiveMessage', data)
                        const Message: Message = {
                            id: data.id,
                            sender_id: data.senderId,
                            receiver_id: data.receiverId,
                            group_id: data.groupId,
                            content: data.content,
                            file_url: data.fileUrl,
                            message_type: data.messageType,
                            status: 'unread',
                            created_at: data.createdAt
                        }
                        const chat = await getChatBy2Id(await getDBConnection(), id, Message.sender_id)
                        if (!chat) {

                            await createChat(await getDBConnection(), {
                                user_id: id,
                                another_id: Message.sender_id,
                                type: 'friend',
                                last_message_id: null,
                                updated_at: Date.now().toLocaleString()
                            })
                        }
                        getDBConnection()
                            .then(db => {
                                insertMessage(db, Message)
                                    .catch(err => console.log(err))
                            }).catch(err => console.log(err))
                    })

                    socket.on('receiveMessageNotification', async (data: {
                        title: string,
                        content: string,
                        time: string,
                        type: 'file' | 'image' | 'text' | 'voice' | 'video',
                        senderId: string
                    }) => {
                        if ((await isFriendMuted(await getDBConnection(), id, data.senderId))) return;
                        displayNotification(
                            data.title,
                            data.type == 'text' ? Base64.decode(data.content) : `[${data.type}]`,
                            data.time);
                    })

                    socket.on('receiveGroupMessageNotification', async (data: {
                        title: string,
                        content: string,
                        time: string,
                        type: 'file' | 'image' | 'text' | 'voice' | 'video',
                        senderId: string
                    }) => {
                        if ((await isGroupMuted(await getDBConnection(), id, data.senderId))) return;
                        displayNotification(
                            data.title,
                            data.type == 'text' ? Base64.decode(data.content) : `[${data.type}]`,
                            data.time);
                    })

                    socket.on('receiveGroupMessage', async (data: any) => {
                        console.log('收到群组消息')
                        context.applyEvent('receiveGroupMessage', data)
                        const Message: Message = {
                            id: data.id,
                            sender_id: data.senderId,
                            receiver_id: data.receiverId,
                            group_id: data.groupId,
                            content: data.content,
                            file_url: data.fileUrl,
                            message_type: data.messageType,
                            status: 'unread',
                            created_at: data.createdAt
                        }
                        const chat = await getChatBy2Id(await getDBConnection(), id, Message.sender_id)
                        if (!chat) {

                            await createChat(await getDBConnection(), {
                                user_id: id,
                                another_id: Message.sender_id,
                                type: 'group',
                                last_message_id: null,
                                updated_at: Date.now().toLocaleString()
                            })
                        }
                        getDBConnection()
                            .then(db => {
                                insertMessage(db, Message)
                                    .catch(err => console.log(err))
                            }).catch(err => console.log(err))
                    })

                    socket.on('addFriend', (data: any) => {
                        displayNotification(
                            'You received a new friend request',
                            data.type == 'text' ? Base64.decode(data.content) : `[${data.type}]`,
                            data.time);
                    })

                    socket.on('acceptFriend', (data: any) => {
                        displayNotification(
                            'Your request is accepted',
                            data.type == 'text' ? Base64.decode(data.content) : `[${data.type}]`,
                            data.time);
                    })

                    socket.on('connectSuccess', (data: string) => {
                        console.log(data);
                    })
                })

                setContext((ctx) => {
                    return {
                        ...ctx,
                        isLogin: true,
                        user: {
                            id: id,
                            password: password
                        },
                        socket: socket
                    }
                })

                props.navigation.replace("HomeScreen");
                return;
            } else {
                context.tip(res.data.msg, 'error');
            }
        } catch (e) {
            console.log(e);
            context.tip('Error', 'error');
        }
    }

    const toRegister = () => {
        props.navigation.replace('Register');
    }

    return (
        <View style={styles.container}>
            <Text
                variant='displayMedium'
                style={{ color: context.theme.current.background.On }}>Qwitter</Text>
            <TextInput
                keyboardType="email-address"
                textContentType="emailAddress"
                cursorColor={context.theme.current.surface.On}
                placeholderTextColor={context.theme.current.surface.On}
                textColor={context.theme.current.surface.On}
                outlineColor={context.theme.current.primary.Normal}
                value={id}
                onChangeText={v => { setId(v) }}
                style={styles.input}
                mode='outlined'
                label='Account' />
            <TextInput
                textContentType="password"
                cursorColor={context.theme.current.surface.On}
                placeholderTextColor={context.theme.current.surface.On}
                textColor={context.theme.current.surface.On}
                outlineColor={context.theme.current.primary.Normal}
                value={password}
                onChangeText={v => { setPassword(v) }}
                secureTextEntry={true}
                style={styles.input}
                mode='outlined'
                label='Password' />
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '80%'
            }}>
                <Button
                    textColor={context.theme.current.secondary.Normal}
                    mode="text"
                    onPress={toRegister}>ToCreate</Button>
                <Button
                    textColor={context.theme.current.primary.On}
                    buttonColor={context.theme.current.primary.Normal}
                    mode='contained'
                    onPress={onLogin}>Connect</Button>
            </View>
        </View>
    )
}

