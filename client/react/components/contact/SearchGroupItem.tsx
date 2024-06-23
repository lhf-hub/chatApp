import { StyleSheet, View, TouchableHighlight } from "react-native";
import { Avatar, Button, Icon, Text } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { User, UserWithRelation } from "../../models/User";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { ImageHandler } from "../../tools/ImageHandler";
import { API } from "../../api/API";
import base64 from "react-native-base64";
import { Group } from "../../models/Group";

interface SearchGroupItemProps {
    navigation: StackNavigationProp<any>
    groupData: Group
    onJoined: () => void
}



export default function SearchGroupItem(props: SearchGroupItemProps) {

    const { context, setContext } = useContext(AppContext);

    const [enter, setEnter] = useState(false)

    useEffect(() => {
        getRelation()
        props.navigation.addListener('focus', () => {
            getRelation()
        })
    }, [])

    const getRelation = async () => {
        try {
            const res1 = await API.group.getGroupsByMemberId(context.user.id)
            const res2 = await API.group.getGroupsByOwnerId(context.user.id)
            if (res1.data.code === 200) {
                console.log(res1.data.data)
                if (res1.data.data.find((item: Group) => item.id == props.groupData.id)) {
                    setEnter(true)
                }
            } else {
                console.log(res1.data.msg)
            }
            if (res2.data.code === 200) {
                console.log(res2.data.data)
                if (res2.data.data.find((item: Group) => item.id == props.groupData.id)) {
                    setEnter(true)
                }
            } else {
                console.log(res1.data.msg)
            }
        } catch (error) {
            console.log(error)
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
            width: '60%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20,
        },
    })

    const joinGroup = async () => {
        try {
            const res = await API.group.joinGroup(props.groupData.id, context.user.id);
            console.log(props.groupData.id, context.user.id)
            if (res.data.code === 200) {
                context.tip('Success', 'success')
                props.onJoined()
            } else {
                context.tip('Apply failed', 'error')
            }
        } catch (e) {
            console.log(e)
            context.tip('Network error', 'error')
        }
    }

    return (
        <TouchableHighlight onLongPress={() => { }}
            onPress={() => { props.navigation.navigate('GroupDetailScreen', { groupData: props.groupData }) }}
            underlayColor="#d0d0d0">
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    {
                        props.groupData.profilePicture
                            ? <Avatar.Image size={42} source={{ uri: ImageHandler.toBase64(base64.decode(props.groupData.profilePicture)) }} />
                            : <Avatar.Text size={42} label={props.groupData.name[0]} />
                    }
                    <View >
                        <Text variant="headlineSmall"
                            style={{ color: context.theme.current.surface.On }}
                            numberOfLines={1}
                            ellipsizeMode='tail'>
                            {props.groupData.name}
                        </Text>
                        <Text variant="bodySmall"
                            style={{ color: context.theme.current.secondary.On }}
                            numberOfLines={1}
                            ellipsizeMode='tail'>
                            {props.groupData.id}
                        </Text>
                    </View>
                </View>

                <Button
                    disabled={enter}
                    mode="outlined"
                    onPress={
                        joinGroup
                    }
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            color: enter ? context.theme.current.divider.Normal : context.theme.current.primary.Normal,
                            width: '100%',
                        }}
                        variant="titleMedium">
                        {enter ? 'Joined' : 'Join'}

                    </Text>
                </Button>


            </View>
        </TouchableHighlight>

    )
}

