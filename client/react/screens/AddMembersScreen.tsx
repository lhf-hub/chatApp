import { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Appbar, Avatar, Button, Divider, Icon, Text } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { User, UserWithGroupRole, UserWithRelation, UserWithRelationCanSelect } from "../models/User";
import { ImageHandler } from "../tools/ImageHandler";
import { RouteProp } from "@react-navigation/native";
import base64 from "react-native-base64";
import { API } from "../api/API";
import { Group } from "../models/Group";
import { ScrollView } from "react-native-gesture-handler";

interface AddMembersScreenProps {
    navigation: StackNavigationProp<any>
    route: RouteProp<{ AddMembersScreen: { groupData: Group } }, 'AddMembersScreen'>
}

export default function AddMembersScreen(props: AddMembersScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [friends, setFriends] = useState<UserWithRelationCanSelect[]>([])

    useEffect(() => {
        getAllFriends()
    }, [])

    const getAllFriends = async () => {
        try {
            const members = await getAllMembers()
            const res = await API.friend.getFirendsById(context.user.id)
            if (res.data.code === 200) {
                const Friends: UserWithRelationCanSelect[] = [];

                (res.data.data as UserWithRelation[]).forEach((item) => {
                    Friends.push({
                        ...item,
                        selected: false
                    })
                })

                setFriends(Friends.filter((user) => {
                    if (members?.find(member => member.id == user.id) != undefined) {
                        return false
                    } else {
                        if (user.status == 'accepted') {
                            return true
                        } else {
                            return false
                        }
                    }
                }))
            } else {
                context.tip(res.data.msg, 'error')
            }
        } catch (e) {
            context.tip('Network error', 'error')
        }
    }

    const getAllMembers = async () => {
        try {
            const res = await API.group.getAllGroupMembers(props.route.params.groupData.id)
            if (res.data.code === 200) {
                const members: UserWithGroupRole[] = res.data.data as UserWithGroupRole[]
                return members
            } else {
                context.tip(res.data.msg, 'error')
            }
        } catch (e) {
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
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            height: '60%',
            padding: 20,
            backgroundColor: context.theme.current.background.Normal,
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

    const addMembers = async () => {
        const toAdd: { groupId: string, userId: string }[] = []
        friends.forEach((item) => {
            if (item.selected) {
                toAdd.push({ groupId: props.route.params.groupData.id, userId: item.id })
            }
        })
        try {
            const res = await API.group.addGroupMembers(toAdd)
            if (res.data.code === 200) {
                context.tip('Add members successfully', 'success')
                props.navigation.goBack()
            } else {
                context.tip(res.data.msg, 'error')
            }
        } catch (e) {
            context.tip('Network error', 'error')
        }

    }


    return (
        <View>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => { props.navigation.goBack() }} color={context.theme.current.background.On}></Appbar.BackAction>
                <Appbar.Action icon='check-circle-outline' onPress={addMembers} color={context.theme.current.background.On} />
            </Appbar.Header>
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={{ color: context.theme.current.primary.Normal, marginBottom: 50 }}
                        variant="titleMedium">
                        Select friends to add to group:
                    </Text>

                    <ScrollView style={{ width: "100%" }} contentContainerStyle={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }} >
                        {
                            friends.map((item, index) => {
                                return (
                                    <TouchableWithoutFeedback
                                        key={index}
                                        onPress={() => {
                                            setFriends((currentFriends) => {
                                                // 创建一个新的数组副本
                                                const updatedFriends = currentFriends.map(friend => {
                                                    // 对于需要更新的那个item，创建一个新的对象副本，并反转其selected属性
                                                    if (friend === item) {
                                                        return { ...friend, selected: !friend.selected };
                                                    }
                                                    // 对于其他项，保持不变
                                                    return friend;
                                                });

                                                return updatedFriends;
                                            });
                                        }}>
                                        <View style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: 10,
                                            margin: 10
                                        }}>
                                            <Avatar.Image

                                                style={{
                                                    borderColor: item.selected ? context.theme.current.secondary.LightVariant : context.theme.current.divider.Normal,
                                                    borderWidth: item.selected ? 5 : 1,
                                                }}
                                                size={60}
                                                source={{ uri: ImageHandler.toBase64(base64.decode(item.profilePicture ?? '')) }} />
                                            <Text style={{ color: context.theme.current.surface.On }} variant="labelLarge">{item.name}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            })

                        }
                    </ScrollView>
                </View>

            </View>

        </View >

    )
}