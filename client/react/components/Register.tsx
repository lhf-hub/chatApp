import { NavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useRef, useState } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { user } from "../api/user";

interface RegisterProps {
    navigation: StackNavigationProp<any>
}

export default function Register(props: RegisterProps) {

    const { context, setContext } = useContext(AppContext);

    const [id, setId] = useState('');

    const [password, setPassword] = useState('');

    const [verifyCode, setVerifyCode] = useState('');

    const [sendButtonDisabled, setSendButtonDisabled] = useState(false);

    const [sendButtonText, setSendButtonText] = useState('Send');

    const sendButtonRestTime = useRef(60);

    const sendButtonInterval = useRef<NodeJS.Timeout | null>(null);

    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            gap: 50,
            backgroundColor: context.theme.current.background.Normal
        },
        input: {
            width: '80%',
            backgroundColor: context.theme.current.surface.Normal
        },
        button: {
            width: '50%',
        }
    });


    const onRegister = async (e: GestureResponderEvent) => {

        try {
            const res = await user.register(id, password, verifyCode);
            console.log(res);
            if (res.data.code == 200) {
                context.tip(res.data.msg, 'success');
                setContext({
                    ...context,
                    user: {
                        id: id,
                        password: password,
                    }
                }),
                    props.navigation.replace("HomeScreen");
            } else {
                context.tip(res.data.msg, 'error');
            }
        } catch (e) {
            console.log(e);
            context.tip('Error', 'error');
        }
    }

    const onSend = async (e: GestureResponderEvent) => {
        if (sendButtonDisabled) return;

        try {
            const res = await user.sendVerificationCode(id);
            if (res.data.code == 200) {
                context.tip('发送成功', 'success');
                setSendButtonDisabled(true);
                sendButtonRestTime.current = 60;
                sendButtonInterval.current = setInterval(() => {
                    if (sendButtonRestTime.current == 0) {

                        setSendButtonDisabled(false);
                        setSendButtonText('Send');
                        if (sendButtonInterval.current) {
                            clearInterval(sendButtonInterval.current);
                            sendButtonRestTime.current = 60;
                        }
                        return;
                    }
                    setSendButtonText(`${sendButtonRestTime.current--}s`);
                }, 1000);
            } else {
                context.tip(res.data.msg, 'error');
            }
        } catch (e) {
            console.log(e);
            context.tip('Error', 'error');
        }
    }

    const toLogin = () => {
        props.navigation.replace('Login');
    }

    return (
        <View style={styles.container}>
            <Text
                variant='displayMedium'
                style={{ color: context.theme.current.background.On }}>Qwitter</Text>
            <TextInput
                cursorColor={context.theme.current.surface.On}
                placeholderTextColor={context.theme.current.surface.On}
                textColor={context.theme.current.surface.On}
                outlineColor={context.theme.current.primary.Normal}
                value={id}
                onChangeText={v => { setId(v) }}
                style={styles.input}
                mode='outlined'
                label='Account' />
            <TextInput
                textContentType="password"
                cursorColor={context.theme.current.surface.On}
                placeholderTextColor={context.theme.current.surface.On}
                textColor={context.theme.current.surface.On}
                outlineColor={context.theme.current.primary.Normal}
                value={password}
                onChangeText={v => { setPassword(v) }}
                secureTextEntry={true}
                style={styles.input}
                mode='outlined'
                label='Password' />
            <View style={{
                display: "flex",
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '80%',
            }}>
                <TextInput
                    cursorColor={context.theme.current.surface.On}
                    placeholderTextColor={context.theme.current.surface.On}
                    textColor={context.theme.current.surface.On}
                    outlineColor={context.theme.current.primary.Normal}
                    value={verifyCode}
                    onChangeText={v => { setVerifyCode(v) }}
                    style={[styles.input, { width: '70%' }]}
                    mode='outlined'
                    label='VerfyCode' />
                <Button
                    textColor={context.theme.current.primary.On}
                    buttonColor={context.theme.current.primary.Normal}
                    mode='contained'
                    onPress={onSend}>{sendButtonText}</Button>
            </View>

            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '80%'
            }}>
                <Button
                    textColor={context.theme.current.secondary.Normal}
                    mode="text"
                    onPress={toLogin}>ToConnect</Button>
                <Button
                    textColor={context.theme.current.primary.On}
                    buttonColor={context.theme.current.primary.Normal}
                    mode='contained'
                    onPress={onRegister}>Create</Button>
            </View>
        </View>
    )
}
