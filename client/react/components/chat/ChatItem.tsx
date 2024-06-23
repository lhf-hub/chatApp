import { StyleSheet, View, Text, TouchableHighlight } from "react-native";
import { Avatar, Badge } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Chat, ChatDetail } from "../../models/Chat";
import { API } from "../../api/API";
import { ImageHandler } from "../../tools/ImageHandler";
import base64 from "react-native-base64";
import { getDBConnection, getFriendChatUnreadCount, getFriendMessages, getGroupChatUnreadCount, getLatestMessage, getMessage } from "../../SQLite/db-service";
import { UserWithRelation } from "../../models/User";
import { Base64 } from "js-base64";

interface ChatItemProps {
    navigation: StackNavigationProp<any>
    chatData: Chat
}

export default function ChatItem(props: ChatItemProps) {
    const { context, setContext } = useContext(AppContext);

    const [chat, setChat] = useState<ChatDetail>()

    useEffect(() => {
        getChatDetail();
    }, [])

    const getChatDetail = async () => {
        var chatDetail: ChatDetail = {
            user_id: '',
            another_id: '',
            type: 'friend',
            updated_at: '',
            last_message_id: null,
            img: '',
            last_message: null,
            unread_count: 0
        }
        switch (props.chatData.type) {
            case 'friend':
                {
                    try {
                        const res1 = await API.user.getUserById(props.chatData.another_id);
                        if (res1.data.code === 200) {
                            chatDetail.img = res1.data.data?.profilePicture ?? ''
                        }
                        const res2 = await getMessage(await getDBConnection(), props.chatData.last_message_id ?? '');
                        chatDetail.last_message = res2 ?? null
                        const res3 = await getFriendChatUnreadCount(await getDBConnection(), context.user.id, props.chatData.another_id);
                        chatDetail.unread_count = res3

                        setChat((cur_chat) => {
                            return {
                                ...chatDetail,
                                ...props.chatData,
                            }
                        })
                    }
                    catch (error) {
                        console.log(error);
                    }
                    break;
                }
            case 'group':
                {
                    try {
                        const res1 = await API.group.getGroupById(props.chatData.another_id);
                        if (res1.data.code === 200) {
                            chatDetail.img = res1.data.data?.profilePicture ?? ''
                        }
                        const res2 = await getMessage(await getDBConnection(), props.chatData.last_message_id ?? '');
                        chatDetail.last_message = res2 ?? null
                        const res3 = await getGroupChatUnreadCount(await getDBConnection(), context.user.id, props.chatData.another_id);
                        chatDetail.unread_count = res3
                        setChat({
                            ...chatDetail,
                            ...props.chatData,
                        })
                    } catch (error) {
                        console.log(error);
                    }
                    break;

                }
            default:
                {
                    console.log('Unknown chat type');
                }

        }

    }

    const toChat = async () => {
        // console.log(chat);
        switch (chat?.type) {
            case 'friend':
                {
                    try {
                        const res = await API.user.getUserById(chat?.another_id);
                        const user: UserWithRelation = {
                            ...res.data.data,
                            status: 'accepted'
                        }
                        props.navigation.navigate('FriendChatScreen', { userData: user })
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                }

            case 'group':
                {
                    try {
                        const res = await API.group.getGroupById(chat?.another_id);
                        props.navigation.navigate('GroupChatScreen', { groupData: res.data.data })
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                }
            default:
                {
                    console.log('Unknown chat type');
                }
        }
    }

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: 70,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: context.theme.current.divider.Normal,
            backgroundColor: context.theme.current.surface.Normal
        },
        avatarContainer: {
            position: 'relative',
            width: 42,
        },
        badge: {
            position: 'absolute',
            top: 0,
            right: 0,
        },
        contentContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            height: '100%',
            flex: 1,
            marginLeft: 10,
        },

        contentTopContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
        },
        contentBottomContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
        }
    })

    return (
        <TouchableHighlight onLongPress={() => { }}
            onPress={toChat}
            underlayColor={context.theme.current.divider.Highlight}>
            <View style={styles.container}>
                <View style={styles.avatarContainer}>
                    {
                        chat?.img
                            ? <Avatar.Image size={42} source={{ uri: ImageHandler.toBase64(base64.decode(chat.img)) }} />
                            : <Avatar.Text size={42} label={chat?.another_id[0] ?? ''} />
                    }
                    <Badge visible={(chat?.unread_count ?? 0) > 0} size={16} style={styles.badge}>{chat?.unread_count}</Badge>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.contentTopContainer}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: context.theme.current.surface.On
                        }}>{chat?.another_id}</Text>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: 'normal',
                            color: 'gray'
                        }}>{new Date(chat?.last_message?.created_at ?? chat?.updated_at ?? '').toTimeString().split(' ')[0]}</Text>
                    </View>
                    <View style={styles.contentBottomContainer}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 'normal',
                            color: 'gray'
                        }}>
                            {
                                chat?.last_message?.message_type == 'text' ?
                                    Base64.decode(chat?.last_message?.content ?? '') :
                                    chat?.last_message?.message_type == 'image' ? '[Image]' :
                                        '[File]'
                            }
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>

    )
}

