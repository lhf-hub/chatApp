import { StyleSheet, View, TouchableHighlight } from "react-native";
import { Avatar, Button, Icon, Text } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { User, UserWithRelation } from "../../models/User";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { ImageHandler } from "../../tools/ImageHandler";
import { API } from "../../api/API";
import base64 from "react-native-base64";

interface PendingItemProps {
    navigation: StackNavigationProp<any>
    userData: UserWithRelation
    onAccept: () => void
}



export default function PendingItem(props: PendingItemProps) {

    const { context, setContext } = useContext(AppContext);

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: context.theme.current.divider.Normal,
        },
        infoContainer: {
            width: '60%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20,
            flex: 1,
        },
    })

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
                    mode="outlined"
                    onPress={acceptFriend}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            color: context.theme.current.warning.Normal,
                            width: '100%',
                        }}
                        variant="titleMedium">
                        Accept
                    </Text>
                </Button>


            </View>
        </TouchableHighlight>

    )
}

