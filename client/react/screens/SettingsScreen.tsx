import { StackNavigationProp } from "@react-navigation/stack";
import { Linking, ScrollView, StyleSheet, TouchableHighlight, View } from "react-native";
import { Appbar, Avatar, Button, Dialog, Divider, Icon, PaperProvider, Portal, Switch, Text, TextInput } from "react-native-paper";
import ChatItem from "../components/chat/ChatItem";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { ImageHandler } from "../tools/ImageHandler";
import base64 from "react-native-base64";
import { User } from "../models/User";
import { API } from "../api/API";
import { ImageLibraryOptions } from "react-native-image-picker";
import * as ImagePicker from "react-native-image-picker";

interface SettingsScreenProps {
    navigation: StackNavigationProp<any>,
}

export default function SettingsScreen(props: SettingsScreenProps) {
    const { context, setContext } = useContext(AppContext);

    const [me, setMe] = useState<User>()

    const [img, setImg] = useState<ImagePicker.Asset[]>([])

    const [name, setName] = useState<string>('')

    const [nameDialogOn, setNameDialogOn] = useState<boolean>(false)

    const [contactDialogOn, setContactDialogOn] = useState<boolean>(false)

    const openContactDialog = () => {
        setContactDialogOn(true)
    }

    const closeContactDialog = () => {
        setContactDialogOn(false)
    }

    const [themeMode, setThemeMode] = useState<boolean>(context.theme.mode == 'dark') // true -> dark, false -> light

    const changeThemeMode = () => {
        context.theme.changeTheme(context.theme.mode == 'dark' ? 'light' : 'dark')
        setThemeMode(!themeMode)
    }

    const chooseImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            selectionLimit: 1,
            includeBase64: true,
            quality: 0.1
        };

        ImagePicker.launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else {
                setImg(response.assets ?? [])
                updateUserAvatar()
            }
        });
    };

    const closeDialog = () => {
        setNameDialogOn(false)
    }

    const openDialog = () => {
        setNameDialogOn(true)
    }

    const updateUserAvatar = async () => {
        const res = await API.user.updateUser(context.user.id, null, stringToByte(img[0]?.base64 ?? ''), null)
        if (res.data.code === 200) {
            context.tip('Update success', 'success')
            getMe()
        } else {
            context.tip('Network error', 'error')
        }
    }

    const updateUserName = async () => {
        const res = await API.user.updateUser(context.user.id, name, null, null)
        if (res.data.code === 200) {
            context.tip('Update success', 'success')
            getMe()
            closeDialog()
        } else {
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

    useEffect(() => {
        getMe()
    }, [])

    const getMe = async () => {
        try {
            const res = await API.user.getUserById(context.user.id)
            if (res.data.code === 200) {
                setMe(res.data.data as User)
            } else {
                context.tip('Network error', 'error')
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
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
        },
        box: {
            display: 'flex',
            width: '100%',
            flex: 1,
            flexDirection: 'column',
            backgroundColor: context.theme.current.surface.Normal,
            paddingTop: 20,
        },
        itemContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: 17,
        },
        content: {
            width: '85%',
            borderRadius: 10,
            borderColor: context.theme.current.divider.Normal,
            borderWidth: 1,
            backgroundColor: context.theme.current.background.Normal,
        }
    })

    const contactUs = () => {
        Linking.openURL('mailto:qwitter@163.com')
    }



    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Content color={context.theme.current.background.On} title="Settings" />
            </Appbar.Header>

            <Portal>
                <Dialog style={{ backgroundColor: context.theme.current.surface.Normal }} visible={nameDialogOn} onDismiss={closeDialog}>
                    <Dialog.Title style={{ color: context.theme.current.background.On }}>Input your name</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            value={name}
                            onChangeText={text => setName(text)}
                            textColor={context.theme.current.surface.On}
                            style={{ backgroundColor: context.theme.current.surface.Normal }}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={closeDialog}>Cancel</Button>
                        <Button onPress={updateUserName}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Portal>
                <Dialog style={{ backgroundColor: context.theme.current.surface.Normal }} visible={contactDialogOn} onDismiss={closeContactDialog}>
                    <Dialog.Title style={{ color: context.theme.current.background.On }}>Contact us</Dialog.Title>
                    <Dialog.Content>
                        <TouchableHighlight onPress={contactUs}>
                            <Text style={{ color: context.theme.current.info.Normal, textAlign: "center", fontSize: 16, textDecorationLine: "underline" }}>Email: qwitter@163.com</Text>
                        </TouchableHighlight>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={closeContactDialog}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>



            <ScrollView style={styles.box} contentContainerStyle={{ alignItems: 'center', gap: 30, paddingBottom: 50, }}>
                {
                    me?.profilePicture
                        ? <Avatar.Image size={150} source={{ uri: ImageHandler.toBase64(base64.decode(me?.profilePicture)) }} />
                        : <Avatar.Text size={150} label={me?.name[0] ?? ''} />
                }
                <Text
                    style={{ color: context.theme.current.surface.On }}
                    variant="headlineLarge">
                    {me?.name}
                </Text>
                <Text
                    style={{ color: context.theme.current.surface.On }}
                    variant="bodyLarge">
                    {me?.id}
                </Text>

                <View style={styles.content}>
                    <TouchableHighlight
                        underlayColor={context.theme.current.divider.Normal}
                        onPress={openDialog}>
                        <View style={styles.itemContainer}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                <View style={{ width: '15%' }}>
                                    <Icon source="account" size={28} color={context.theme.current.primary.Normal} />
                                </View>
                                <Text
                                    style={{ color: context.theme.current.primary.Normal, width: '85%' }}
                                    variant="titleMedium">
                                    Change Name
                                </Text>
                            </View>
                            <Divider style={{
                                width: '90%',
                                backgroundColor: context.theme.current.divider.Highlight,
                                position: 'absolute',
                                right: 0,
                                bottom: 0
                            }} />
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                        underlayColor={context.theme.current.divider.Normal}
                        onPress={chooseImage}>
                        <View style={styles.itemContainer}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                <View style={{ width: '15%' }}>
                                    <Icon source="camera" size={28} color={context.theme.current.primary.Normal} />
                                </View>
                                <Text
                                    style={{ color: context.theme.current.primary.Normal, width: '85%' }}
                                    variant="titleMedium">
                                    Change Avatar
                                </Text>
                            </View>
                        </View>
                    </TouchableHighlight>

                </View>

                <View style={styles.content}>
                    <View style={styles.itemContainer}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Text
                                style={{ color: context.theme.current.primary.Normal, width: '85%' }}
                                variant="titleMedium">
                                Theme Mode
                            </Text>

                            <Switch value={themeMode} onValueChange={changeThemeMode}></Switch>
                        </View>
                        <Divider style={{
                            width: '90%',
                            backgroundColor: context.theme.current.divider.Highlight,
                            position: 'absolute',
                            right: 0,
                            bottom: 0
                        }} />
                    </View>

                    <TouchableHighlight
                        underlayColor={context.theme.current.divider.Normal}
                        onPress={openContactDialog}>
                        <View style={styles.itemContainer}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                <Text
                                    style={{ color: context.theme.current.primary.Normal, width: '85%' }}
                                    variant="titleMedium">
                                    Contact us
                                </Text>
                            </View>
                            <Divider style={{
                                width: '90%',
                                backgroundColor: context.theme.current.divider.Highlight,
                                position: 'absolute',
                                right: 0,
                                bottom: 0
                            }} />
                        </View>
                    </TouchableHighlight>


                    <TouchableHighlight
                        underlayColor={context.theme.current.divider.Normal}
                        onPress={() => {
                            context.socket.disconnect()
                            setContext({
                                ...context,
                                user: {
                                    id: '',
                                    password: '',
                                },
                                isLogin: false,
                                socket: context.socket,
                            })

                            props.navigation.navigate('Login')
                        }}>
                        <View style={styles.itemContainer}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                <Text
                                    style={{ color: context.theme.current.primary.Normal, width: '85%' }}
                                    variant="titleMedium">
                                    Log out
                                </Text>
                            </View>
                        </View>
                    </TouchableHighlight>

                </View>



            </ScrollView>



        </View>
    )
}


