import { StackNavigationProp } from "@react-navigation/stack";
import { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Text, TextInput } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { ImageLibraryOptions } from "react-native-image-picker";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import * as ImagePicker from 'react-native-image-picker';
import { API } from "../api/API";



interface CreateGroupScreenProps {
    navigation: StackNavigationProp<any>,
}

export default function CreateGroupScreen(props: CreateGroupScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [groupName, setGroupName] = useState('')
    const [description, setDescription] = useState('')
    const [img, setImg] = useState<ImagePicker.Asset[]>([])

    const chooseImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 1,
            includeBase64: true,
            // 尽量低一些
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

    const createGroup = async () => {
        try {
            const res = await API.group.createGroup(groupName, stringToByte(img[0].base64 ?? ''), description, context.user.id);
            if (res.data.code === 200) {
                context.tip('Group created', 'success')
                props.navigation.goBack()
            } else {
                context.tip('Create failed', 'error')
            }
        } catch (e) {
            console.log(e)
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

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            backgroundColor: context.theme.current.background.Normal,
        },
        container: {
            display: 'flex',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            backgroundColor: context.theme.current.surface.Normal
        },
        contactItemsContainer: {
            display: 'flex',
            backgroundColor: context.theme.current.surface.Normal
        },
        input: {
            backgroundColor: context.theme.current.surface.Normal
        },
    })
    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction color={context.theme.current.background.On} onPress={() => { props.navigation.goBack() }} />
                <Appbar.Content color={context.theme.current.background.On} title="Create Group" />
                <Appbar.Action color={context.theme.current.background.On} icon="check-circle-outline" onPress={createGroup} />
            </Appbar.Header>
            <View style={styles.contactItemsContainer}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: context.theme.current.background.Normal,
                    marginTop: 20,
                    padding: 18,
                    gap: 10,
                }}>
                    <Text variant="bodyLarge" style={{ color: context.theme.current.surface.On }} >Group Name</Text>
                    <TextInput
                        cursorColor={context.theme.current.surface.On}
                        placeholderTextColor={context.theme.current.surface.On}
                        textColor={context.theme.current.surface.On}
                        outlineColor={context.theme.current.primary.Normal}
                        value={groupName}
                        onChangeText={v => { setGroupName(v) }}
                        style={[styles.input, { flex: 1 }]}
                        mode='outlined'
                        label='Name' />
                </View>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: context.theme.current.background.Normal,
                    marginTop: 20,
                    padding: 18,
                    gap: 10,
                }}>
                    <Text variant="bodyLarge" style={{ color: context.theme.current.surface.On }} >Select a picture</Text>
                    <TouchableWithoutFeedback onPress={chooseImage}>
                        <Avatar.Image source={{ uri: img[0]?.uri }}></Avatar.Image>
                    </TouchableWithoutFeedback>

                </View>

                <View style={{
                    backgroundColor: context.theme.current.background.Normal,
                    marginTop: 20,
                    padding: 18,
                    gap: 10,
                    height: "50%"
                }}>
                    <Text variant="bodyLarge" style={{ color: context.theme.current.surface.On }} >Description</Text>
                    <TextInput
                        cursorColor={context.theme.current.surface.On}
                        placeholderTextColor={context.theme.current.surface.On}
                        textColor={context.theme.current.surface.On}
                        outlineColor={context.theme.current.primary.Normal}
                        value={description}
                        onChangeText={v => { setDescription(v) }}
                        style={[styles.input, { flex: 1 }]}
                        mode='outlined'
                        label='Description' />
                </View>

            </View>

        </View>
    )
}