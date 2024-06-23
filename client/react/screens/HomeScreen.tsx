import { StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "./ChatListScreen";
import ContactListScreen from "./ContactListScreen";
import SettingsScreen from "./SettingsScreen";

const Tab = createBottomTabNavigator();

interface HomeScreenProps {
    navigation: StackNavigationProp<any>
}

export default function HomeScreen(props: HomeScreenProps) {

    const { context, setContext } = useContext(AppContext);

    useEffect(() => {
        if (!context.isLogin) {
            props.navigation.replace('Login');
        }
    });

    return (
        <View style={styles.container}>
            <Tab.Navigator screenOptions={
                {
                    tabBarActiveTintColor: context.theme.current.primary.Normal,
                    tabBarInactiveTintColor: context.theme.current.surface.On,
                    tabBarStyle: {
                        backgroundColor: context.theme.current.background.Normal,
                        borderTopWidth: 0
                    },
                    tabBarIcon: () => null,
                    tabBarLabelStyle: {
                        textAlign: 'center', // 文字居中
                        fontSize: 14,
                        bottom: 14,
                        fontWeight: 'bold'
                    }
                }

            }>
                <Tab.Screen name="Chats" component={ChatListScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Contacts" component={ContactListScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
            </Tab.Navigator>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
    },
    chatItemsContainer: {
        display: 'flex',
        flex: 1,
    }
})