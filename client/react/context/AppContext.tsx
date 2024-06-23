import React from "react";
import { ITheme } from "../theme/ITheme";
import { LightTheme } from "../theme/LightTheme";
import io, { Socket } from 'socket.io-client';

export type ContextType = {
    context: ContextStateType
    setContext: React.Dispatch<React.SetStateAction<ContextStateType>>
};

export type ContextStateType = {
    isLogin: boolean
    screen: {
        width: number,
        height: number
    }
    theme: {
        mode: 'light' | 'dark'
        current: ITheme
        changeTheme: (mode: 'light' | 'dark') => void
    }
    user: UserContext,
    tip: (content: string, type: 'info' | 'error' | 'warning' | 'success', fadeTime?: number) => void
    events: Map<string, Function>
    applyEvent: (key: string, ...args: any[]) => void
    socket: Socket
}

export type UserContext = {
    id: string,
    password: string
}

export const AppContext = React.createContext<ContextType>({
    context: {
        isLogin: false,
        screen: {
            width: 0,
            height: 0
        },
        theme: {
            mode: 'light',
            current: LightTheme,
            changeTheme: (mode: 'light' | 'dark') => { }
        },
        user: {
            id: '',
            password: ''
        },
        tip: (content: string, type: 'info' | 'error' | 'warning' | 'success', fadeTime?: number) => {
        },
        events: new Map<string, Function>(),
        applyEvent: (key: string, ...args: any[]) => { },
        socket: io()
    },
    setContext: (value) => { },

});