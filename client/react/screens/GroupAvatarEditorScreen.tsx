import { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Appbar, Avatar, Button, Divider, Icon, Text } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { User, UserWithGroupRole, UserWithRelation } from "../models/User";
import { ImageHandler } from "../tools/ImageHandler";
import { RouteProp } from "@react-navigation/native";
import base64 from "react-native-base64";
import { API } from "../api/API";
import { Group } from "../models/Group";
import * as ImagePicker from "react-native-image-picker";
import { ImageLibraryOptions } from "react-native-image-picker";

interface GroupAvatarEditorScreenProps {
    navigation: StackNavigationProp<any>
    route: RouteProp<{ GroupAvatarEditorScreen: { groupData: Group } }, 'GroupAvatarEditorScreen'>
}

export default function GroupAvatarEditorScreen(props: GroupAvatarEditorScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [img, setImg] = useState<ImagePicker.Asset[]>([])

    const chooseImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 1,
            includeBase64: true,
            quality: 0.1
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else {
                setImg(response.assets ?? [])
            }
        });
    };

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
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            padding: 20,
            backgroundColor: context.theme.current.background.Normal,
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

    const updateGroupAvatar = async () => {
        try {
            const res = await API.group.updateGroup(
                props.route.params.groupData.id,
                props.route.params.groupData.ownerId,
                null,
                stringToByte(img[0].base64 ?? props.route.params.groupData.profilePicture ?? ''),
                null
            )
            if (res.data.code === 200) {
                context.tip(res.data.msg, 'success')
                props.navigation.goBack()
            } else {
                context.tip(res.data.msg, 'error')
            }
        } catch (e) {
            context.tip('Network error', 'error')
        }

    }

    const stringToByte = (base64: string) => {
        var bytes = new Array();
        var len, c;
        len = base64.length;
        for (var i = 0; i < len; i++) {
            c = base64.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    }


    return (
        <View>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => { props.navigation.goBack() }} color={context.theme.current.background.On}></Appbar.BackAction>
                <Appbar.Action icon='check-circle-outline' onPress={updateGroupAvatar} color={context.theme.current.background.On} />
            </Appbar.Header>
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={{ color: context.theme.current.primary.Normal, marginBottom: 50 }}
                        variant="titleMedium">
                        Select a picture:
                    </Text>
                    <TouchableWithoutFeedback onPress={chooseImage}>
                        <Avatar.Image size={231} source={{ uri: img[0]?.uri ?? ImageHandler.toBase64(base64.decode(props.route.params.groupData?.profilePicture ?? '') ?? '') ?? '' }}></Avatar.Image>
                    </TouchableWithoutFeedback>
                </View>

            </View>

        </View >

    )
}