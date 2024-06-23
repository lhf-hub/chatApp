import { StyleSheet, View, TouchableHighlight } from "react-native";
import { Avatar, Button, Icon, Text } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { User, UserWithRelation } from "../../models/User";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { ImageHandler } from "../../tools/ImageHandler";
import base64 from 'react-native-base64'

interface FriendItemProps {
    navigation: StackNavigationProp<any>
    userData: UserWithRelation
}

export default function FriendItem(props: FriendItemProps) {

    const { context, setContext } = useContext(AppContext);

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
                        <Text
                            variant="headlineSmall"
                            style={{ color: context.theme.current.surface.On }}>
                            {props.userData.name}
                        </Text>
                        <Text variant="bodySmall" style={{ color: context.theme.current.secondary.On }}>{props.userData.id}</Text>
                    </View>
                </View>

                <Icon color={context.theme.current.surface.On} source="account" size={42} />
            </View>
        </TouchableHighlight>

    )
}

