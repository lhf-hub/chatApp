import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Avatar, Button, Divider, Icon, Text } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { User, UserWithRelation } from "../models/User";
import { ImageHandler } from "../tools/ImageHandler";
import { RouteProp } from "@react-navigation/native";
import base64 from "react-native-base64";
import { API } from "../api/API";
import { addMuteFriend, deleteMuteFriend, getDBConnection, isFriendMuted } from "../SQLite/db-service";

interface UserDetailScreenProps {
    navigation: StackNavigationProp<any>
    route: RouteProp<{ UserDetailScreen: { userData: UserWithRelation } }, 'UserDetailScreen'>
}

export default function UserDetailScreen(props: UserDetailScreenProps) {
    const { context, setContext } = useContext(AppContext);

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

    const [isMuted, setIsMuted] = useState<boolean>(false)

    useEffect(() => {
        getDBConnection().then(db => {
            isFriendMuted(db, context.user.id, props.route.params.userData.id).then(muted => {
                setIsMuted(muted);
            })
        })

    }, [])

    const toChat = () => {
        props.navigation.navigate('FriendChatScreen', { userData: props.route.params.userData })
    }

    const muteFriend = async () => {
        try {
            addMuteFriend(await getDBConnection(), context.user.id, props.route.params.userData.id)
            setIsMuted(true)
        } catch (e) {
            console.log(e)
        }
    }

    const unMuteFriend = async () => {
        try {
            deleteMuteFriend(await getDBConnection(), context.user.id, props.route.params.userData.id)
            setIsMuted(false)
        } catch (e) {
            console.log(e)
        }
    }

    const deleteFriend = async () => {
        try {
            const res = await API.friend.deleteFriend(context.user.id, props.route.params.userData.id);
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

    const blockFriend = async () => {
        try {
            const res = await API.friend.blockFriend(context.user.id, props.route.params.userData.id);
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
            </Appbar.Header>
            <View style={styles.container}>
                {
                    props.route.params.userData.profilePicture
                        ? <Avatar.Image size={150} source={{ uri: ImageHandler.toBase64(base64.decode(props.route.params.userData.profilePicture)) }} />
                        : <Avatar.Text size={150} label={props.route.params.userData.name[0]} />
                }
                <Text
                    style={{ color: context.theme.current.surface.On }}
                    variant="headlineLarge">
                    {props.route.params.userData.name}
                </Text>

                {
                    props.route.params.userData.status === 'accepted' ?
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
                                onPress={isMuted ? unMuteFriend : muteFriend}
                                style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={24} source={isMuted ? 'volume-variant-off' : 'volume-medium'} color={context.theme.current.warning.LightVariant}></Icon>
                            </Button>
                            <Button
                                contentStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}
                                onPress={deleteFriend}
                                style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={24} source="delete" color={context.theme.current.error.LightVariant}></Icon>
                            </Button>
                            <Button
                                contentStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 5 }}
                                onPress={blockFriend}
                                style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={24} source="block-helper" color={context.theme.current.error.DarkVariant}></Icon>
                            </Button>
                        </View>
                        : undefined
                }



                <View style={styles.content}>
                    <View style={styles.itemContainer}>
                        <Text
                            style={{ color: context.theme.current.primary.Normal }}
                            variant="titleMedium">
                            Account ID:
                        </Text>
                        <Text
                            style={{ color: context.theme.current.surface.On }}
                            variant="titleMedium">
                            {props.route.params.userData.id}
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
                            2000-01-01
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
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem debitis repudiandae dicta quae enim quo voluptas, asperiores quam mollitia nam molestiae veritatis amet fugiat beatae alias adipisci eaque eveniet officiis!
                        </Text>
                    </View>

                </View>

            </View>

        </View>
    )
}