import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Avatar, Button, Divider, Icon, Text } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { User, UserWithGroupRole, UserWithRelation } from "../models/User";
import { ImageHandler } from "../tools/ImageHandler";
import { RouteProp } from "@react-navigation/native";
import base64 from "react-native-base64";
import { API } from "../api/API";
import { Group } from "../models/Group";
import { TouchableHighlight } from "react-native-gesture-handler";
import MemberItem from "../components/contact/MemberItem";

interface ManageMembersScreenProps {
    navigation: StackNavigationProp<any>
    route: RouteProp<{ ManageMembersScreen: { groupData: Group } }, 'ManageMembersScreen'>
}

export default function ManageMembersScreen(props: ManageMembersScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [members, setMembers] = useState<UserWithGroupRole[]>([])

    const [group, setGroup] = useState<Group>()

    useEffect(() => {
        setGroup(props.route.params.groupData)
        const ev = props.navigation.addListener('focus', () => {
            getGroup()
            getAllMembers()
        })
        return ev;
    }, [])

    const getGroup = async () => {
        try {
            const res = await API.group.getGroupById(props.route
                .params.groupData.id)
            if (res.data.code === 200) {

                setGroup(res.data.data as Group)
            } else {
                setGroup(props.route.params.groupData)
            }
        } catch (error) {
            context.tip('Network error', 'error')
        }
    }




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
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: 20,
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

    const getAllMembers = async () => {
        try {
            const res = await API.group.getAllGroupMembers(group?.id ?? props.route.params.groupData.id)
            if (res.data.code === 200) {
                const Members = (res.data.data as UserWithGroupRole[]).filter((item) => item.role != 'owner')
                setMembers(Members)
            } else {
                context.tip('Get members failed', 'error')
            }
        } catch (e) {
            context.tip('Network error', 'error')
        }
    }

    return (
        <View>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => { props.navigation.goBack() }} color={context.theme.current.background.On}></Appbar.BackAction>
            </Appbar.Header>
            <View style={styles.container}>

                <View style={styles.content}>
                    {
                        members.map((member, index) => {
                            return (
                                <MemberItem
                                    key={index}
                                    userData={member}
                                    navigation={props.navigation} />
                            )
                        })
                    }
                </View>

            </View>

        </View>
    )
}