import { StackNavigationProp } from "@react-navigation/stack";
import { useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Touchable, TouchableOpacity, VirtualizedList, ScrollView, Alert } from "react-native";
import { Appbar, Divider, Icon, TextInput } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { RouteProp } from "@react-navigation/native";
import { UserWithRelation } from "../models/User";
import MessageItem from "../components/chat/MessageItem";
import { Message } from "../models/Message";
import { createChat, getChatBy2Id, getDBConnection, getFriendMessages, getGroupMessages, insertMessage, readMessage } from "../SQLite/db-service";
import { Group } from "../models/Group";
import { readFile } from "react-native-fs";
import { ImageLibraryOptions } from "react-native-image-picker";
import * as ImagePicker from "react-native-image-picker";
import DocumentPicker from 'react-native-document-picker'

interface GroupChatScreenProps {
    navigation: StackNavigationProp<any>
    route: RouteProp<{ GroupChatScreen: { groupData: Group } }, 'GroupChatScreen'>
}
const GroupChatScreen = (props: GroupChatScreenProps) => {
    const { context, setContext } = useContext(AppContext);

    const [messages, setMessages] = useState<Message[]>([])

    const [textInput, setTextInput] = useState<string>('')

    const [content, setContent] = useState<Buffer>(Buffer.from(''))

    const MessageListRef = useRef<VirtualizedList<Message>>(null)

    const chooseImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 1,
            includeBase64: true,
            quality: 0.1
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else {
                sendMessage({
                    id: Date.now().toString(),
                    senderId: context.user.id,
                    receiverId: null,
                    groupId: props.route.params.groupData.id,
                    content: response.assets?.[0].base64 ?? '',
                    fileUrl: response.assets?.[0].uri,
                    messageType: 'image',
                    status: 'unread',
                    createdAt: Date.now()
                })
            }
        });
    };
    useEffect(() => {
        // TODO
        setTimeout(() => {
            MessageListRef.current?.scrollToEnd({ animated: true })
        }, 600);
    }, [messages])

    useEffect(() => {
        context.events.set('receiveGroupMessage', onReceiveMessage)
        getMessages()
    }, [])





    const getMessages = async () => {
        try {
            const chat = await getChatBy2Id(await getDBConnection(), context.user.id, props.route.params.groupData.id)
            if (!chat) {
                await createChat(await getDBConnection(), {
                    user_id: context.user.id,
                    another_id: props.route.params.groupData.id,
                    type: 'group',
                    last_message_id: null,
                    updated_at: Date.now().toLocaleString()
                })
            } else {
                const res = await getGroupMessages(await getDBConnection(), context.user.id, props.route.params.groupData.id)
                const ids: string[] = []
                res.forEach(i => {
                    if (i.status == 'unread') {
                        ids.push(i.id)
                    }
                })
                await readMessage(await getDBConnection(), ids)
                setMessages((() => { return res }))
            }
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessage = async (message: any) => {
        var Message: Message = {
            id: message.id,
            sender_id: message.senderId,
            receiver_id: message.receiverId,
            group_id: message.groupId,
            content: message.content,
            file_url: message.fileUrl,
            message_type: message.messageType,
            status: 'unread',
            created_at: message.createdAt
        }
        setMessages((currentMessages) => {
            const updatedMessages = [...currentMessages, Message];
            return updatedMessages;
        })
        context.socket.emit('sendGroupMessage', JSON.stringify(message));
        Message.status = 'read';
        getDBConnection()
            .then(db => {
                insertMessage(db, Message)
                    .catch(err => console.log(err))
            }).catch(err => console.log(err))
    }

    const onReceiveMessage = (data: any) => {
        console.log('收到群组消息回调')
        const Message: Message = {
            id: data[0].id,
            sender_id: data[0].senderId,
            receiver_id: data[0].receiverId,
            group_id: data[0].groupId,
            content: data[0].content,
            file_url: data[0].fileUrl,
            message_type: data[0].messageType,
            status: 'unread',
            created_at: data[0].createdAt
        }

        // console.log([...messages, Message])
        // if (Message.sender_id !== props.route.params.userData.id) return;
        setMessages((currentMessages) => {
            const updatedMessages = [...currentMessages, Message];
            return updatedMessages;
        })
    }

    const selectFile = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
            });
            console.log(res.size)
            if ((res.size ?? 0) > 1024 * 1024 * 10) {
                Alert.alert('File size too large', 'File size should be less than 10MB', [{ text: 'OK' }])
                return;
            }
            const file = await readFile(res.uri, 'base64')
            setContent(Buffer.from(file));
            sendMessage({
                id: Date.now().toString(),
                senderId: context.user.id,
                receiverId: null,
                groupId: props.route.params.groupData.id,
                content: Buffer.from(file).toString('base64'),
                fileUrl: res.name,
                messageType: 'file',
                status: 'unread',
                createdAt: Date.now()
            })
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker
            } else {
                console.log(err);
            }
        }
    };

    const getItemCount = () => { return messages.length }

    const getItem = (data: any, index: number) => {
        return messages[index]
    }

    const sendText = () => {
        sendMessage({
            id: Date.now().toString(),
            senderId: context.user.id,
            receiverId: null,
            groupId: props.route.params.groupData.id,
            content: Buffer.from(textInput).toString('base64'),
            fileUrl: null,
            messageType: 'text',
            status: 'unread',
            createdAt: Date.now()
        })
        setTextInput('')
    }


    const styles = StyleSheet.create({
        header: {
            width: '100%',
            backgroundColor: context.theme.current.background.Normal
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            backgroundColor: context.theme.current.surface.Normal,
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            minWidth: '100%',
            padding: 20,
            gap: 30,
        },
        input: {
            width: '50%',
            margin: 10,
            marginBottom: 15,
            backgroundColor: context.theme.current.background.Normal
        }
    })
    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Action color={context.theme.current.surface.On} icon="arrow-left" onPress={() => { props.navigation.goBack() }} />
                <Appbar.Content color={context.theme.current.surface.On} title="Chat" />
                <Appbar.Action color={context.theme.current.surface.On} icon="magnify" onPress={() => { }} />
            </Appbar.Header>
            <View style={{ flex: 1 }}>
                <VirtualizedList ref={MessageListRef}
                    data={messages}
                    renderItem={
                        ({ item }: { item: Message }) =>
                            <MessageItem navigation={props.navigation} messageData={item} />}
                    keyExtractor={(item: Message) => item.id}
                    getItemCount={getItemCount}
                    getItem={getItem}
                    contentContainerStyle={styles.content}>
                </VirtualizedList>

            </View>
            <Divider />
            <View style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                backgroundColor: context.theme.current.background.Normal,
            }}>
                <TouchableOpacity style={{
                    width: '10%',
                    left: 20,
                    bottom: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                    onPress={chooseImage}>
                    <Icon
                        color={context.theme.current.surface.On}
                        source="file-image-plus"
                        size={38}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: '10%',
                    left: 20,
                    bottom: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                    onPress={selectFile}>
                    <Icon
                        color={context.theme.current.surface.On}
                        source="file"
                        size={38}
                    />
                </TouchableOpacity>
                <TextInput
                    value={textInput}
                    onChangeText={v => { setTextInput(v) }}
                    cursorColor={context.theme.current.surface.On}
                    placeholderTextColor={context.theme.current.surface.On}
                    textColor={context.theme.current.surface.On}
                    outlineColor={context.theme.current.primary.Normal}
                    mode="outlined"
                    label="type something..."
                    multiline
                    style={styles.input}
                />
                <TouchableOpacity style={{
                    width: '10%',
                    right: 20,
                    bottom: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                    onPress={sendText}>
                    <Icon
                        color={context.theme.current.surface.On}
                        source="send-circle-outline"
                        size={38}
                    />
                </TouchableOpacity>
            </View>




        </View>
    )
}



export default GroupChatScreen;