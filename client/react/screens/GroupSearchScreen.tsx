import { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, TextInput } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import UserItem from "../components/contact/UserItem";
import { User, UserWithRelation } from "../models/User";
import { StackNavigationProp } from "@react-navigation/stack";
import { API } from "../api/API";
import { Group } from "../models/Group";
import SearchGroupItem from "../components/contact/SearchGroupItem";

interface GroupSearchScreenProps {
    navigation: StackNavigationProp<any>
}

export default function GroupSearchScreen(props: GroupSearchScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [searchString, setSearchString] = useState('');

    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            backgroundColor: context.theme.current.background.Normal
        },
        header: {
            width: '100%',
            height: 'auto',
            backgroundColor: context.theme.current.surface.Normal
        },
        input: {
            width: '100%',
            backgroundColor: context.theme.current.surface.Normal,
            top: 0
        }
    });

    const onSearchGroups = async () => {
        try {
            const res = await API.group.getGroupById(searchString);
            console.log(res.data.data)
            if (res.data.code === 200) {
                setGroups([res.data.data]);
            } else {
                context.tip(res.data.msg, 'error');
            }
        } catch (e) {
            context.tip('Network error', 'error');
            console.log(e)
        }

    }

    const [groups, setGroups] = useState<Group[]>([]);



    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <TextInput
                    cursorColor={context.theme.current.surface.On}
                    placeholderTextColor={context.theme.current.surface.On}
                    textColor={context.theme.current.surface.On}
                    outlineColor={context.theme.current.primary.Normal}
                    value={searchString}
                    onChangeText={v => { setSearchString(v) }}
                    style={styles.input}
                    right={<TextInput.Icon color={context.theme.current.surface.On} icon="account-search" onPress={onSearchGroups} />}
                    mode='outlined'
                    label='Group Account' />
            </Appbar.Header>
            <ScrollView>
                {
                    groups.map((group, index) => {
                        return <SearchGroupItem
                            key={index}
                            groupData={group}
                            navigation={props.navigation}
                            onJoined={onSearchGroups} />
                    })
                }
            </ScrollView>
        </View>
    )
}