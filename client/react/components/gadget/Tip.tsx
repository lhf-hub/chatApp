import React, { useContext, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { AppContext } from "../../context/AppContext";
interface TipProps {
    content: string
    type: 'info' | 'warning' | 'error' | 'success',
    visible: boolean,
}



export default function Tip(props: TipProps) {
    const { context, setContext } = useContext(AppContext);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const IconMap = {
        'info': "information-outline",
        'warning': "alert-outline",
        'error': "alert-circle-outline",
        'success': "check-circle-outline",
    }

    const ThemeMap = {
        'info': context.theme.current.info,
        'warning': context.theme.current.warning,
        'error': context.theme.current.error,
        'success': context.theme.current.success
    }

    useEffect(() => {
        if (props.visible) {
            fadeIn();
        } else {
            fadeOut();
        }
    }, [props.visible]);

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            top: context.screen.height * 0.05,
            height: context.screen.height * 0.05,
            width: context.screen.width * 0.5,
            left: context.screen.width * 0.5 - context.screen.width * 0.25,
            zIndex: 1000,
            borderRadius: context.screen.height * 0.025,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            shadowColor: '#000',
            shadowOffset: {
                width: 10,
                height: 10,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.00,
            elevation: 5,

        },
        info: {
            backgroundColor: context.theme.current.info.Normal,
        },
        warning: {
            backgroundColor: context.theme.current.warning.Normal,
        },
        error: {
            backgroundColor: context.theme.current.error.Normal,
        },
        success: {
            backgroundColor: context.theme.current.success.Normal,
        }
    });
    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                zIndex: 1001,
            }} >
            <View style={[styles.container, styles[props.type as keyof typeof styles]]}>
                {<Icon
                    source={IconMap[props.type as keyof typeof IconMap]}
                    color={ThemeMap[props.type as keyof typeof ThemeMap].LightVariant}
                    size={30} />}
                <Text variant="bodyMedium" style={{ color: ThemeMap[props.type as keyof typeof ThemeMap].LightVariant }}>{props.content}</Text>
            </View>
        </Animated.View>

    );

}

