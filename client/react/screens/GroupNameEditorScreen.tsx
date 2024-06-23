import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Avatar, Button, Divider, Icon, Text } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { User, UserWithGroupRole, UserWithRelation } from "../models/User";
import { ImageHandler } from "../tools/ImageHandler";
import { RouteProp } from "@react-navigation/native";
import base64 from "react-native-base64";
import { API } from "../api/API";
import { Group } from "../models/Group";
import { TextInput, TouchableHighlight } from "react-native-gesture-handler";
import { Events } from "../context/Events";

interface GroupNameEditorScreenProps {
    navigation: StackNavigationProp<any>
    route: RouteProp<{ GroupNameEditorScreen: { groupData: Group } }, 'GroupNameEditorScreen'>
}

export default function GroupNameEditorScreen(props: GroupNameEditorScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [groupName, setGroupName] = useState("");

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

    useEffect(() => {
        setGroupName(props.route.params.groupData.name)
    }, [])

    const updateGroupName = async () => {
        try {
            const res = await API.group.updateGroup(props.route.params.groupData.id, props.route.params.groupData.ownerId, groupName, null, null)
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
                <Appbar.Action icon='check-circle-outline' onPress={updateGroupName} color={context.theme.current.background.On} />
            </Appbar.Header>
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={{ color: context.theme.current.primary.Normal }}
                        variant="titleMedium">
                        Group Name:
                    </Text>
                    <TextInput

                        onChangeText={(text) => { setGroupName(text) }}
                        style={{ color: context.theme.current.surface.On, maxWidth: '60%', fontSize: 20 }}
                        value={groupName} />
                </View>

            </View>

        </View >

    )
}