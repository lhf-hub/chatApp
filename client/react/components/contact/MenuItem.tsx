import { StyleSheet, View, TouchableHighlight, Alert } from "react-native";
import { Icon, Text } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

interface MenuItemProps {
    navigation: StackNavigationProp<any>
    icon: string
    text: string
    to: string
}

export default function MenuItem(props: MenuItemProps) {

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
        <TouchableHighlight onLongPress={() => { }}
            onPress={() => { props.navigation.navigate(props.to) }}
            underlayColor="#d0d0d0">
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <Icon color={context.theme.current.surface.On} source={props.icon} size={42} />
                    <Text
                        variant="headlineSmall"
                        style={{ color: context.theme.current.primary.Normal }}>
                        {props.text}
                    </Text>
                </View>
                <Icon color={context.theme.current.surface.On} source="chevron-right" size={42} />
            </View>
        </TouchableHighlight>

    )
}

