import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Avatar, Button, Divider, Icon, Menu, Text } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { ImageHandler } from "../tools/ImageHandler";
import { RouteProp } from "@react-navigation/native";
import base64 from "react-native-base64";
import { API } from "../api/API";
import { Group } from "../models/Group";
import { addMuteGroup, deleteMuteGroup, getDBConnection, isGroupMuted } from "../SQLite/db-service";

interface GroupDetailScreenProps {
    navigation: StackNavigationProp<any>
    route: RouteProp<{ GroupDetailScreen: { groupData: Group } }, 'GroupDetailScreen'>
}

export default function GroupDetailScreen(props: GroupDetailScreenProps) {
    const { context, setContext } = useContext(AppContext);
    const [leftTopMenuOn, setLeftTopMenuOn] = useState(false);
    const [group, setGroup] = useState<Group>()

    useEffect(() => {
        setGroup(props.route.params.groupData)
        const ev = props.navigation.addListener('focus', () => {
            getGroup()
        })
        return ev
    }, [])

    const [isMuted, setIsMuted] = useState<boolean>(false)

    useEffect(() => {
        getDBConnection().then(db => {
            isGroupMuted(db, context.user.id, props.route.params.groupData.id).then(muted => {
                setIsMuted(muted);
            })
        })

    }, [])

    const muteGroup = async () => {
        try {
            addMuteGroup(await getDBConnection(), context.user.id, props.route.params.groupData.id)
            setIsMuted(true)
        } catch (e) {
            console.log(e)
        }
    }

    const unmuteGroup = async () => {
        try {
            deleteMuteGroup(await getDBConnection(), context.user.id, props.route.params.groupData.id)
            setIsMuted(false)
        } catch (e) {
            console.log(e)
        }
    }

    const getGroup = async () => {
        try {
            const res = await API.group.getGroupById(props.route
                .params.groupData.id)
            if (res.data.code === 200) {
                setGroup(res.data.data as Group)
            } else {
                setGroup(props.route.params.groupData)
            }
        } catch (error) {
            console.log(error)
            context.tip('Network error', 'error')
        }
    }


    const styles = StyleSheet.create({
        header: {
            width: '100%',
            backgroundColor: context.theme.current.background.Normal,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        container: {
            display: 'flex',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: context.theme.current.surface.Normal,
            paddingTop: 20,
            gap: 30

        },
        itemContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: 20,
        },
        content: {
            width: '85%',
            borderRadius: 10,
            borderColor: context.theme.current.divider.Normal,
            borderWidth: 1,
            backgroundColor: context.theme.current.background.Normal,
        },
        buttonGroups: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '85%',
            borderRadius: 10,
            borderColor: context.theme.current.divider.Normal,
            borderWidth: 1,
            backgroundColor: context.theme.current.background.Normal,
        }
    })

    const toChat = () => {
        props.navigation.navigate('GroupChatScreen', { groupData: group })
    }


    const exitGroup = async () => {
        if (context.user.id === group?.ownerId) {
            context.tip('You are the owner of this group, you cannot exit', 'error');
            return;
        }
        try {
            const res = await API.group.exitGroup(group?.id ?? '', context.user.id);
            if (res.data.code === 200) {
                context.tip(res.data.msg, 'success');
                props.navigation.goBack();
            } else {
                context.tip(res.data.msg, 'error');
            }
        } catch (e) {
            console.log(e)
            context.tip('Network error', 'error')
        }
    }

    const toManageMembers = async () => {
        setLeftTopMenuOn(false);
        props.navigation.navigate('ManageMembersScreen', { groupData: group });
    }

    const toManageGroup = async () => {
        setLeftTopMenuOn(false);
        props.navigation.navigate('ManageGroupScreen', { groupData: group });
    }

    const toAddMembers = async () => {
        setLeftTopMenuOn(false);
        props.navigation.navigate('AddMembersScreen', { groupData: group });
    }

    const deleteGroup = async () => {
        setLeftTopMenuOn(false);
        try {
            const res = await API.group.deleteGroup(group?.id ?? '', context.user.id);
            if (res.data.code === 200) {
                context.tip(res.data.msg, 'success');
                props.navigation.goBack();
            } else {
                context.tip(res.data.msg, 'error');
            }
        } catch (e) {
            context.tip('Network error', 'error')
        }
    }


    return (
        <View>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => { props.navigation.goBack() }} color={context.theme.current.background.On}></Appbar.BackAction>
                {
                    context.user.id === group?.ownerId
                        ? <Menu contentStyle={{ backgroundColor: context.theme.current.surface.Normal, opacity: 0.7 }}
                            visible={leftTopMenuOn}
                            onDismiss={() => { setLeftTopMenuOn(false) }}
                            anchor={
                                <Appbar.Action
                                    icon="menu"
                                    color={context.theme.current.background.On}
                                    onPress={() => { setLeftTopMenuOn(true) }} />
                            }>
                            <Menu.Item
                                titleStyle={{ color: context.theme.current.surface.On }}
                                onPress={toManageMembers} title="Manage Members" />
                            <Menu.Item
                                titleStyle={{ color: context.theme.current.surface.On }}
                                onPress={toManageGroup} title="Manage Group" />
                            <Menu.Item
                                titleStyle={{ color: context.theme.current.surface.On }}
                                onPress={toAddMembers} title="Add Members" />
                            <Menu.Item
                                titleStyle={{ color: context.theme.current.surface.On }}
                                onPress={deleteGroup} title="Delete Group" />
                        </Menu>
                        : undefined
                }
            </Appbar.Header>
            <View style={styles.container}>
                {
                    group?.profilePicture
                        ? <Avatar.Image size={150} source={{ uri: ImageHandler.toBase64(base64.decode(group?.profilePicture)) }} />
                        : <Avatar.Text size={150} label={group?.name[0] ?? ''} />
                }

                <Text
                    style={{ color: context.theme.current.surface.On }}
                    variant="headlineLarge">
                    {group?.name}
                </Text>

                <View style={styles.buttonGroups}>
                    <Button
                        contentStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}
                        onPress={toChat}
                        style={{ alignItems: 'center', justifyContent: 'center' }}
                    >

                        <Icon size={24} source="chat" color={context.theme.current.info.LightVariant}></Icon>
                    </Button>
                    <Button
                        contentStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}
                        onPress={isMuted ? unmuteGroup : muteGroup}
                        style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={24} source={isMuted ? 'volume-variant-off' : 'volume-medium'} color={context.theme.current.warning.LightVariant}></Icon>
                    </Button>
                    <Button
                        contentStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}
                        onPress={exitGroup}
                        style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={24} source="exit-run" color={context.theme.current.error.LightVariant}></Icon>
                    </Button>
                </View>

                <View style={styles.content}>
                    <View style={styles.itemContainer}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode='tail'
                            style={{ color: context.theme.current.primary.Normal }}
                            variant="titleMedium">
                            Group Name:
                        </Text>
                        <Text

                            style={{ color: context.theme.current.surface.On }}
                            variant="titleMedium">
                            {group?.name}
                        </Text>
                        <Divider style={{
                            width: '100%',
                            backgroundColor: context.theme.current.divider.Highlight,
                            position: 'absolute',
                            right: 0,
                            bottom: 0
                        }} />
                    </View>

                    <View style={styles.itemContainer}>
                        <Text
                            style={{ color: context.theme.current.primary.Normal }}
                            variant="titleMedium">
                            Group ID:
                        </Text>
                        <Text
                            style={{ color: context.theme.current.surface.On }}
                            variant="titleMedium">
                            {group?.id}
                        </Text>
                        <Divider style={{
                            width: '100%',
                            backgroundColor: context.theme.current.divider.Highlight,
                            position: 'absolute',
                            right: 0,
                            bottom: 0
                        }} />
                    </View>

                    <View style={styles.itemContainer}>
                        <Text
                            style={{ color: context.theme.current.primary.Normal }}
                            variant="titleMedium">
                            Area:
                        </Text>
                        <Text
                            style={{ color: context.theme.current.surface.On }}
                            variant="titleMedium">
                            {
                                ['China', 'Japan', 'Korea', 'America', 'England', 'France', 'Germany', 'Italy', 'Spain', 'Russia']
                                [Math.floor(Math.random() * 10)]
                            }
                        </Text>
                        <Divider style={{
                            width: '100%',
                            backgroundColor: context.theme.current.divider.Highlight,
                            position: 'absolute',
                            right: 0,
                            bottom: 0
                        }} />
                    </View>

                    <View style={styles.itemContainer}>
                        <Text
                            style={{ color: context.theme.current.primary.Normal }}
                            variant="titleMedium">
                            Birthday:
                        </Text>
                        <Text
                            style={{ color: context.theme.current.surface.On }}
                            variant="titleMedium">
                            1998-08-08
                        </Text>
                        <Divider style={{
                            width: '100%',
                            backgroundColor: context.theme.current.divider.Highlight,
                            position: 'absolute',
                            right: 0,
                            bottom: 0
                        }} />
                    </View>

                    <View style={styles.itemContainer}>
                        <Text
                            style={{ color: context.theme.current.primary.Normal }}
                            variant="titleMedium">
                            Intro:
                        </Text>
                        <Text
                            style={{
                                color: context.theme.current.surface.On,
                            }}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                            variant="titleMedium">
                            {group?.description}
                        </Text>
                    </View>

                </View>

            </View>

        </View>
    )
}