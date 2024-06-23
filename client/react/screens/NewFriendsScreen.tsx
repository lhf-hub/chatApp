import { StackNavigationProp } from "@react-navigation/stack";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, List, Menu, Text } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { User, UserWithRelation } from "../models/User";
import { API } from "../api/API";
import PendingItem from "../components/contact/PendingItem";

interface NewFriendsScreenProps {
    navigation: StackNavigationProp<any>,
}

export default function NewFriendsScreen(props: NewFriendsScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [friends, setFriends] = useState<UserWithRelation[]>([])

    useEffect(() => {
        getPendings()
    }, [])

    const getPendings = async () => {
        const res = await API.friend.getFirendsById(context.user.id)
        if (res.data.code === 200) {
            // 过滤出 status = 'pendingReceive'
            const Friends = (res.data.data as UserWithRelation[]).filter((user) => {
                return user.status === 'pendingReceive';
            })
            setFriends(Friends);
        } else {
            context.tip(res.data.msg, 'error');
        }
    }


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
        contactItemsContainer: {
            display: 'flex',
            backgroundColor: context.theme.current.surface.Normal
        }
    })
    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction color={context.theme.current.background.On} onPress={() => { props.navigation.goBack() }} />
                <Appbar.Content color={context.theme.current.background.On} title="New Friends" />
            </Appbar.Header>
            <ScrollView style={styles.contactItemsContainer}>
                {
                    friends.map((friend, index) => (
                        <PendingItem
                            key={index}
                            navigation={props.navigation}
                            userData={friend}
                            onAccept={() => {
                                getPendings();
                            }} />
                    ))
                }

            </ScrollView>

        </View>
    )
}