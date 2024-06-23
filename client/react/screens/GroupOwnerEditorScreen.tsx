import { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Appbar, Avatar, Button, Divider, Icon, Text } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { User, UserWithGroupRole, UserWithRelation } from "../models/User";
import { ImageHandler } from "../tools/ImageHandler";
import { RouteProp } from "@react-navigation/native";
import base64 from "react-native-base64";
import { API } from "../api/API";
import { Group } from "../models/Group";
import { ScrollView, TextInput, TouchableHighlight } from "react-native-gesture-handler";
import { Events } from "../context/Events";
import * as ImagePicker from "react-native-image-picker";
import { ImageLibraryOptions } from "react-native-image-picker";

interface GroupOwnerEditorScreenProps {
    navigation: StackNavigationProp<any>
    route: RouteProp<{ GroupOwnerEditorScreen: { groupData: Group } }, 'GroupOwnerEditorScreen'>
}

export default function GroupOwnerEditorScreen(props: GroupOwnerEditorScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [members, setMembers] = useState<UserWithGroupRole[]>([])

    const [newOwner, setNewOwner] = useState<UserWithGroupRole>()

    useEffect(() => {
        getAllMembers()
    }, [])

    const getAllMembers = async () => {
        try {
            const res = await API.group.getAllGroupMembers(props.route.params.groupData.id)
            if (res.data.code === 200) {
                setMembers(res.data.data as UserWithGroupRole[])
                setNewOwner((res.data.data as UserWithGroupRole[]).find((item) => item.id === props.route.params.groupData.ownerId))
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

    const updateGroupOwner = async () => {
        try {
            const res = await API.group.switchGroupOwner(
                props.route.params.groupData.id,
                props.route.params.groupData.ownerId,
                newOwner?.id ?? props.route.params.groupData.ownerId
            )
            if (res.data.code === 200) {
                context.tip(res.data.msg, 'success')
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
                <Appbar.Action icon='check-circle-outline' onPress={updateGroupOwner} color={context.theme.current.background.On} />
            </Appbar.Header>
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={{ color: context.theme.current.primary.Normal, marginBottom: 50 }}
                        variant="titleMedium">
                        Select a new owner:
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
                            members.map((item, index) => {
                                return (
                                    <TouchableWithoutFeedback
                                        key={index}
                                        onPress={() => {
                                            setNewOwner(item)
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
                                                    borderColor: item == newOwner ? context.theme.current.secondary.LightVariant : context.theme.current.divider.Normal,
                                                    borderWidth: item == newOwner ? 5 : 1,
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