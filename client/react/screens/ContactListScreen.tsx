import { StackNavigationProp } from "@react-navigation/stack";
import { useContext, useEffect, useState } from "react";
import { InteractionManager, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Divider, List, Menu, Text } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import FriendItem from "../components/contact/FriendItem";
import MenuItem from "../components/contact/MenuItem";
import { User, UserWithRelation } from "../models/User";
import { API } from "../api/API";
import GroupItem from "../components/contact/GroupItem";
import { Group } from "../models/Group";

interface ContactListScreenProps {
    navigation: StackNavigationProp<any>,
}

export default function ContactListScreen(props: ContactListScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [friends, setFriends] = useState<UserWithRelation[]>([])

    const [groupsOwned, setGroupsOwned] = useState<Group[]>([])

    const [groupsJoined, setGroupsJoined] = useState<Group[]>([])

    useEffect(() => {
        const onNavigationFocus = props.navigation.addListener('focus', () => {
            if (!context.isLogin) {
                props.navigation.replace('Login');
            }
            getFriends();
            getGroups();

        });

        // 在组件卸载时取消监听
        return onNavigationFocus;
    }, []);


    const getFriends = async () => {

        try {
            const res = await API.friend.getFirendsById(context.user.id)
            if (res.data.code === 200) {
                // 过滤出好友 status = 'accepted'
                const Friends = (res.data.data as UserWithRelation[]).filter((user) => {
                    return user.status === 'accepted';
                })
                setFriends([]);
                setFriends(Friends);
            } else {
                setFriends([]);
            }
        } catch (e) {
            console.log(e)
            context.tip('Network error', 'error');
        }
    }

    const getGroups = async () => {


        try {
            const res_o = await API.group.getGroupsByOwnerId(context.user.id)
            const res_j = await API.group.getGroupsByMemberId(context.user.id)

            if (res_o.data.code == 200) {
                setGroupsOwned([]);
                setGroupsOwned(res_o.data.data as Group[]);

            } else {
                setGroupsOwned([])
            }

            if (res_j.data.code == 200) {
                setGroupsJoined([]);
                setGroupsJoined(res_j.data.data as Group[]);
            } else {
                setGroupsJoined([])
            }
        } catch (e) {
            console.log(e)
            context.tip('Network error', 'error');
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
            flex: 1
        }
    })
    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Content color={context.theme.current.background.On} title="Contacts" />
                <Appbar.Action color={context.theme.current.background.On} icon="account-multiple-plus-outline" onPress={() => { props.navigation.navigate('GroupSearchScreen') }} />
                <Appbar.Action color={context.theme.current.background.On} icon="account-plus-outline" onPress={() => { props.navigation.navigate('UserSearchScreen') }} />
            </Appbar.Header>
            <View>
                <MenuItem to="CreateGroupScreen" navigation={props.navigation} icon="account-group" text="Create Group" />
                <MenuItem to="NewFriendsScreen" navigation={props.navigation} icon="account-multiple" text="New Friends" />
                <MenuItem to="BlockedListScreen" navigation={props.navigation} icon="account-off-outline" text="Blocked List" />
            </View>
            <Divider style={{ backgroundColor: context.theme.current.divider.Highlight }}></Divider>
            <ScrollView style={styles.contactItemsContainer}>
                <Text variant="bodyLarge" style={{
                    color: context.theme.current.background.On,
                    borderBottomWidth: 1,
                    borderBottomColor: context.theme.current.divider.Normal,
                    borderTopWidth: 1,
                    borderTopColor: context.theme.current.divider.Normal,
                    backgroundColor: context.theme.current.background.Normal,
                    paddingLeft: 20
                }}>Friends</Text>
                {
                    friends.length > 0 ?
                        friends.map((friend, index) => {
                            return <FriendItem
                                key={index}
                                navigation={props.navigation}
                                userData={friend} />
                        }) :
                        <Text variant="titleLarge" style={{
                            color: context.theme.current.surface.On,
                            backgroundColor: context.theme.current.surface.Normal,
                            textAlign: 'center',
                            margin: 10
                        }}>No Friends</Text>
                }
                <Text variant="bodyLarge" style={{
                    color: context.theme.current.background.On,
                    borderBottomWidth: 1,
                    borderBottomColor: context.theme.current.divider.Normal,
                    borderTopWidth: 1,
                    borderTopColor: context.theme.current.divider.Normal,
                    backgroundColor: context.theme.current.background.Normal,
                    paddingLeft: 20
                }}>Groups</Text>
                {
                    groupsOwned.length > 0 ?
                        groupsOwned.map((group, index) => {
                            return <GroupItem
                                key={index}
                                navigation={props.navigation}
                                groupData={group} />
                        }) :
                        <Text variant="titleLarge" style={{
                            color: context.theme.current.surface.On,
                            backgroundColor: context.theme.current.surface.Normal,
                            textAlign: 'center',
                            margin: 10
                        }}>No Owned Groups</Text>
                }
                <Divider style={{ backgroundColor: context.theme.current.divider.Highlight }}></Divider>
                {
                    groupsJoined.length > 0 ?
                        groupsJoined.map((group, index) => {
                            return <GroupItem
                                key={index}
                                navigation={props.navigation}
                                groupData={group} />
                        }) :
                        <Text variant="titleLarge" style={{
                            color: context.theme.current.surface.On,
                            backgroundColor: context.theme.current.surface.Normal,
                            textAlign: 'center',
                            margin: 10
                        }}>No Joined Groups</Text>
                }
            </ScrollView>



        </View>
    )
}