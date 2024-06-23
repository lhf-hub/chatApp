import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { API } from "../api/API";
import { Group } from "../models/Group";
import { TextInput, TouchableHighlight } from "react-native-gesture-handler";


interface GroupIntroEditorScreenProps {
    navigation: StackNavigationProp<any>
    route: RouteProp<{ GroupIntroEditorScreen: { groupData: Group } }, 'GroupIntroEditorScreen'>
}

export default function GroupIntroEditorScreen(props: GroupIntroEditorScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [groupIntro, setGroupIntro] = useState("");

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
            alignItems: 'flex-start',
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
        setGroupIntro(props.route.params.groupData.description ?? '')
    }, [])

    const updateGroupName = async () => {
        try {
            const res = await API.group.updateGroup(props.route.params.groupData.id, props.route.params.groupData.ownerId, null, null, groupIntro)
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
                        Group Intro:
                    </Text>
                    <TextInput
                        multiline
                        onChangeText={(text) => { setGroupIntro(text) }}
                        style={{ color: context.theme.current.surface.On, maxWidth: '100%', fontSize: 20 }}
                        value={groupIntro} />
                </View>

            </View>

        </View >

    )
}