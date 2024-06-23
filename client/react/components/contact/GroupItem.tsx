import { StyleSheet, View, TouchableHighlight } from "react-native";
import { Avatar, Button, Icon, Text } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { ImageHandler } from "../../tools/ImageHandler";
import { API } from "../../api/API";
import { Group } from "../../models/Group";
import base64 from 'react-native-base64'

interface GroupItemProps {
    navigation: StackNavigationProp<any>
    groupData: Group
}

export default function GroupItem(props: GroupItemProps) {

    const { context, setContext } = useContext(AppContext);

    const [group, setGroup] = useState<Group>()

    useEffect(() => {
        setGroup(props.groupData)
        const ev = props.navigation.addListener('focus', () => {
            getGroup()
        })
        return ev
    }, [])

    const getGroup = async () => {
        try {
            const res = await API.group.getGroupById(props.groupData.id)
            if (res.data.code === 200) {
                setGroup(res.data.data as Group)
            } else {
                setGroup(props.groupData)
            }
        } catch (error) {
            context.tip('Network error', 'error')
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
        infoContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20,
        },
        button: {
            color: context.theme.current.primary.Normal
        }
    })

    return (
        <TouchableHighlight onLongPress={() => { }}
            onPress={() => { props.navigation.navigate('GroupDetailScreen', { groupData: group }) }}
            underlayColor="#d0d0d0">
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    {
                        group?.profilePicture == ""
                            ? <Avatar.Text size={42} label={group.name[0]} />
                            : <Avatar.Image size={42} source={{ uri: ImageHandler.toBase64(base64.decode(group?.profilePicture ?? '') ?? '') }} />
                    }
                    <View >
                        <Text
                            variant="headlineSmall"
                            style={{ color: context.theme.current.surface.On }}>
                            {group?.name}
                        </Text>
                        <Text variant="bodySmall" style={{ color: context.theme.current.secondary.On }}>{group?.id}</Text>
                    </View>
                </View>

                <Icon color={context.theme.current.surface.On} source="account-group" size={42} />
            </View>
        </TouchableHighlight>

    )
}

