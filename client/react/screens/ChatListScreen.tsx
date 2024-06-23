import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import ChatItem from "../components/chat/ChatItem";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Chat } from "../models/Chat";
import { getDBConnection, getMyChats } from "../SQLite/db-service";


interface ChatListScreenProps {
    navigation: StackNavigationProp<any>,
}

export default function ChatListScreen(props: ChatListScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [chats, setChats] = useState<Chat[]>([]);

    const getChats = async () => {
        setChats([]);
        try {
            const res = await getMyChats(await getDBConnection(), context.user.id);
            setChats(res);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        props.navigation.addListener('focus', () => {
            getChats();
        })
        return () => {
            props.navigation.removeListener('focus', () => {
                getChats();
            })
        }
    }, [])

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            backgroundColor: context.theme.current.background.Normal,
        },
        container: {
            display: 'flex',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            backgroundColor: context.theme.current.surface.Normal
        },
        chatItemsContainer: {
            display: 'flex',
        }
    })

    return (
        <View>
            <Appbar.Header style={styles.header}>
                <Appbar.Content color={context.theme.current.background.On} title="Chats" />
                <Appbar.Action color={context.theme.current.background.On} icon="magnify" onPress={() => { }} />
            </Appbar.Header>

            <ScrollView scrollEnabled style={styles.container}>
                {
                    chats.length === 0 ? <Text variant="titleLarge" style={{
                        color: context.theme.current.surface.On,
                        backgroundColor: context.theme.current.surface.Normal,
                        textAlign: 'center',
                        margin: 10
                    }}>No Chats</Text> :
                        chats.map((chat, index) => {
                            return <ChatItem key={index} navigation={props.navigation} chatData={chat} />
                        })
                }

            </ScrollView>


        </View>
    )
}


