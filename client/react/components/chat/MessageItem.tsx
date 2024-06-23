import { Button, Image, StyleSheet, TouchableHighlight, View } from "react-native";
import { AppContext } from "../../context/AppContext";
import { useContext, useEffect, useState } from "react";
import { Dialog, Portal, Text } from "react-native-paper";
import { Message } from "../../models/Message";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { ImageHandler } from "../../tools/ImageHandler";
import base64 from "react-native-base64";
import { Base64 } from "js-base64";
import { DocumentDirectoryPath, DownloadDirectoryPath, exists, writeFile } from "react-native-fs";

interface MessageItemProps {
    navigation: StackNavigationProp<any>
    messageData: Message
}

export default function MessageItem(props: MessageItemProps) {

    const { context, setContext } = useContext(AppContext)

    const [imgSize, setImgSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        if (props.messageData.message_type == 'image') {
            Image.getSize(ImageHandler.toBase64(props.messageData.content ?? ''), (width, height) => {
                setImgSize({ width: width, height: height })
            })
        }
    }, [])

    const downloadFile = async () => {
        if (props.messageData.file_url == null) return
        // 如果文件已经下载
        if (await exists(DownloadDirectoryPath + '/' + props.messageData.file_url)) {
            context.tip('Already downloaded', 'warning')
            return
        }
        writeFile(DownloadDirectoryPath + '/' + props.messageData.file_url, Base64.decode(props.messageData.content ?? ''), 'base64')
            .then(() => context.tip('Download success', 'success'))
            .catch(e => console.log(e))

    }


    const styles = StyleSheet.create({
        ccc: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: context.user.id == props.messageData.sender_id ? 'flex-end' : 'flex-start',
        },
        container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: context.user.id == props.messageData.sender_id ? 'flex-end' : 'flex-start',
        },
        box: {
            maxWidth: '70%',
            padding: 10,
            borderWidth: 2,
            borderColor: context.theme.current.divider.Normal,
            borderRadius: 10,
            backgroundColor: context.user.id == props.messageData.sender_id ? context.theme.current.primary.Normal : context.theme.current.background.Normal,

        },
        text: {
            color: context.user.id == props.messageData.sender_id ? context.theme.current.primary.On : context.theme.current.surface.On,
            flexWrap: 'wrap',
        }
    })

    return (
        <View style={styles.ccc}>
            <Text style={{ color: context.theme.current.divider.Highlight }}>
                {props.messageData.sender_id?.split('@')[0]}
            </Text>
            <View style={styles.container}>

                <View style={styles.box}>
                    {
                        props.messageData.message_type == 'text' ?
                            <Text style={styles.text}>{Base64.decode(props.messageData.content ?? '')}</Text> :
                            props.messageData.message_type == 'image' ?
                                <Image
                                    source={{ uri: ImageHandler.toBase64(props.messageData.content ?? '') }}
                                    width={imgSize.width * 0.1}
                                    height={imgSize.height * 0.1}
                                    resizeMode="contain" /> :
                                <TouchableHighlight onPress={downloadFile} underlayColor={context.theme.current.divider.Highlight}>
                                    <Text style={styles.text}>[File]</Text>
                                </TouchableHighlight>
                    }

                </View>
            </View>
        </View >

    )
}