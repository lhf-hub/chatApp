import { StyleSheet, View, TouchableHighlight } from "react-native";
import { Avatar, Button, Icon, Text } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { User, UserWithGroupRole, UserWithRelation } from "../../models/User";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { ImageHandler } from "../../tools/ImageHandler";
import base64 from 'react-native-base64'
import { API } from "../../api/API";

interface MemberItemProps {
    navigation: StackNavigationProp<any>
    userData: UserWithGroupRole
}

export default function MemberItem(props: MemberItemProps) {

    const { context, setContext } = useContext(AppContext);

    const deleteMember = async () => {
        try {
            const res = await API.group.deleteGroupMember(props.userData.groupId, props.userData.id)
            if (res.data.code === 200) {
                context.tip('Member deleted', 'success')
                props.navigation.goBack()
            } else {
                context.tip(res.data.msg, 'error')
            }
        } catch (e) {
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
        <TouchableHighlight
            onPress={() => { }}
            underlayColor="#d0d0d0">
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    {
                        props.userData.profilePicture
                            ? <Avatar.Image size={42} source={{ uri: ImageHandler.toBase64(base64.decode(props.userData.profilePicture)) }} />
                            : <Avatar.Text size={42} label={props.userData.name[0]} />
                    }

                    <View >
                        <Text
                            variant="headlineSmall"
                            style={{ color: context.theme.current.surface.On }}>
                            {props.userData.name}
                        </Text>
                        <Text variant="bodySmall" style={{ color: context.theme.current.secondary.On }}>{props.userData.id}</Text>
                    </View>
                </View>

                <Button
                    style={{ backgroundColor: context.theme.current.background.Normal }}
                    mode="outlined"
                    textColor={context.theme.current.error.Normal}
                    onPress={deleteMember}>
                    Kick
                </Button>
            </View>
        </TouchableHighlight>

    )
}

