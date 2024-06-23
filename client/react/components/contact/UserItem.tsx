import { StyleSheet, View, TouchableHighlight } from "react-native";
import { Avatar, Button, Icon, Text } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { User, UserWithRelation } from "../../models/User";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { ImageHandler } from "../../tools/ImageHandler";
import { API } from "../../api/API";
import base64 from "react-native-base64";

interface UserItemProps {
    navigation: StackNavigationProp<any>
    userData: UserWithRelation
    onApplySent: () => void
    onAccept: () => void
}



export default function UserItem(props: UserItemProps) {

    const { context, setContext } = useContext(AppContext);



    const RelationMap = {
        'self': 'Me',
        'accepted': 'Friend',
        'pendingSend': 'Pending',
        'pendingReceive': 'Accept',
        'rejectedSend': 'Rejected',
        'rejectedReceive': 'Be Rejected',
        'stranger': 'Add',
        'blockedSend': 'Blocked',
        'blockedReceive': 'Be Blocked'

    }

    const ColorMap = {
        'self': context.theme.current.primary.Normal,
        'accepted': context.theme.current.success.Normal,
        'pendingSend': context.theme.current.warning.Normal,
        'pendingReceive': context.theme.current.warning.Normal,
        'rejectedSend': context.theme.current.error.Normal,
        'rejectedReceive': context.theme.current.error.Normal,
        'stranger': context.theme.current.secondary.Normal,
        'blockedSend': context.theme.current.error.Normal,
        'blockedReceive': context.theme.current.error.Normal

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

    const addFriend = async () => {
        try {
            const res = await API.friend.addFriend(context.user.id, props.userData.id);
            if (res.data.code === 200) {
                context.tip('apply sent', 'success')
                props.onApplySent()
            } else {
                context.tip('apply failed', 'error')
            }
        } catch (e) {
            console.log(e)
            context.tip('Network error', 'error')
        }
    }

    const acceptFriend = async () => {
        try {
            const res = await API.friend.acceptFriend(context.user.id, props.userData.id);
            if (res.data.code === 200) {
                context.tip('accepted', 'success')
                props.onAccept()
            } else {
                context.tip('apply failed', 'error')
            }
        } catch (e) {
            console.log(e)
            context.tip('Network error', 'error')
        }
    }

    return (
        <TouchableHighlight onLongPress={() => { }}
            onPress={() => { props.navigation.navigate('UserDetailScreen', { userData: props.userData }) }}
            underlayColor="#d0d0d0">
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    {
                        props.userData.profilePicture
                            ? <Avatar.Image size={42} source={{ uri: ImageHandler.toBase64(base64.decode(props.userData.profilePicture)) }} />
                            : <Avatar.Text size={42} label={props.userData.name[0]} />
                    }
                    <View >
                        <Text variant="headlineSmall"
                            style={{ color: context.theme.current.surface.On }}
                            numberOfLines={1}
                            ellipsizeMode='tail'>
                            {props.userData.name}
                        </Text>
                        <Text variant="bodySmall"
                            style={{ color: context.theme.current.secondary.On }}
                            numberOfLines={1}
                            ellipsizeMode='tail'>
                            {props.userData.id}
                        </Text>
                    </View>
                </View>

                <Button
                    disabled={props.userData.status !== 'stranger' && props.userData.status !== 'pendingReceive'}
                    mode="outlined"
                    onPress={
                        props.userData.status === 'stranger' ?
                            addFriend :
                            props.userData.status === 'pendingReceive' ?
                                acceptFriend : () => { }
                    }
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            color: ColorMap[props.userData.status],
                            width: '100%',
                        }}
                        variant="titleMedium">
                        {RelationMap[props.userData.status]}

                    </Text>
                </Button>


            </View>
        </TouchableHighlight>

    )
}

