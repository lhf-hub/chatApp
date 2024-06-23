import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Login from './react/components/Login';


import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { CardStyleInterpolators, StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './react/screens/HomeScreen';
import { AppContext, ContextStateType } from './react/context/AppContext';
import ChatScreen from './react/screens/FriendChatScreen';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import Tip from './react/components/gadget/Tip';
import { LightTheme } from './react/theme/LightTheme';
import { DarkTheme } from './react/theme/DarkTheme';
import Register from './react/components/Register';
import UserSearchScreen from './react/screens/UserSearchScreen';
import CreateGroupScreen from './react/screens/CreateGroupScreen';
import NewFriendsScreen from './react/screens/NewFriendsScreen';
import BlockedListScreen from './react/screens/BlockedListScreen';
import UserDetailScreen from './react/screens/UserDetailScreen';
import { UserWithRelation } from './react/models/User';
import GroupDetailScreen from './react/screens/GroupDetailScreen';
import ManageGroupScreen from './react/screens/ManageGroupScreen';
import GroupNameEditorScreen from './react/screens/GroupNameEditorScreen';
import GroupAvatarEditorScreen from './react/screens/GroupAvatarEditorScreen';
import GroupIntroEditorScreen from './react/screens/GroupIntroEditorScreen';
import GroupOwnerEditorScreen from './react/screens/GroupOwnerEditorScreen';
import ManageMembersScreen from './react/screens/ManageMembersScreen';
import SettingsScreen from './react/screens/SettingsScreen';
import FriendChatScreen from './react/screens/FriendChatScreen';
import GroupChatScreen from './react/screens/GroupChatScreen';
import { io } from 'socket.io-client';
import { Message } from './react/models/Message';
import AddMembersScreen from './react/screens/AddMembersScreen';
import GroupSearchScreen from './react/screens/GroupSearchScreen';





const Stack = createStackNavigator();


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // const MD3theme = useTheme();

  const { width, height } = useWindowDimensions();



  const [tipType, setTipType] = useState<'info' | 'error' | 'warning' | 'success'>('info');
  const [tipContent, setTipContent] = useState<string>('');
  const [tipVisible, setTipVisible] = useState<boolean>(false);
  const defaultUserData: UserWithRelation = {
    status: 'self',
    id: '',
    name: '',
    profilePicture: '',
    password: '',
    createdAt: '',
    updatedAt: ''
  }

  const tipVisibleRef = useRef<boolean>(false);

  const timer = useRef<NodeJS.Timeout | null>(null);

  const changeTheme = (mode: 'light' | 'dark') => {
    if (mode === 'light') {
      setContext((prevState) => {
        return {
          ...prevState,
          theme: {
            mode: 'light',
            current: LightTheme,
            changeTheme: changeTheme
          }
        }
      });
    } else {
      setContext((prevState) => {
        return {
          ...prevState,
          theme: {
            mode: 'dark',
            current: DarkTheme,
            changeTheme: changeTheme
          }
        }
      });
    }
  }



  const [context, setContext] = useState<ContextStateType>({
    isLogin: false,
    screen: {
      width: width,
      height: height
    },
    theme: {
      mode: 'dark',
      current: DarkTheme,
      changeTheme: changeTheme
    },
    user: {
      id: '',
      password: '',
    },
    tip: (content: string, type: 'info' | 'error' | 'warning' | 'success', fadetime = 1000) => {
      setTipVisible((prevState) => { tipVisibleRef.current = true; return (prevState = true) });
      if (tipVisibleRef.current) {
        if (timer.current != null) {
          clearTimeout(timer.current);
        }
        setTipVisible((prevState) => { tipVisibleRef.current = false; return (prevState = false) });
      }
      setTipVisible((prevState) => { tipVisibleRef.current = true; return (prevState = true) });
      setTipContent(content);
      setTipType(type);

      timer.current = setTimeout(() => {
        setTipVisible((prevState) => { tipVisibleRef.current = false; return (prevState = false) });
      }, fadetime);
    },
    events: new Map<string, Function>(),
    applyEvent: (key: string, ...args: any[]) => {
      if (context.events.has(key)) {
        context.events.get(key)?.call(null, args);
      }
    },
    socket: io()
  });

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <PaperProvider>
        <AppContext.Provider value={{ context, setContext }}>
          <Tip visible={tipVisible} content={tipContent} type={tipType} />
          <NavigationContainer>
            <Stack.Navigator screenOptions={{
              // 使用从右侧滑入的转场动画
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,

            }}>
              <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
              <Stack.Screen name="FriendChatScreen" component={FriendChatScreen} options={{ headerShown: false }} />
              <Stack.Screen name="GroupChatScreen" component={GroupChatScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
              <Stack.Screen
                name='UserSearchScreen'
                component={UserSearchScreen}
                options={{
                  title: 'Search User',
                  headerStyle: { backgroundColor: context.theme.current.background.Normal },
                  headerTintColor: context.theme.current.surface.On,
                }} />
              <Stack.Screen
                name="UserDetailScreen"
                component={UserDetailScreen}
                options={{ headerShown: false }} />
              <Stack.Screen
                name="GroupDetailScreen"
                component={GroupDetailScreen}
                options={{ headerShown: false }} />
              <Stack.Screen
                name="ManageGroupScreen"
                component={ManageGroupScreen}
                options={{ headerShown: false }} />
              <Stack.Screen
                name="GroupNameEditorScreen"
                component={GroupNameEditorScreen}
                options={{ headerShown: false }} />
              <Stack.Screen
                name="GroupAvatarEditorScreen"
                component={GroupAvatarEditorScreen}
                options={{ headerShown: false }} />
              <Stack.Screen
                name="GroupIntroEditorScreen"
                component={GroupIntroEditorScreen}
                options={{ headerShown: false }} />
              <Stack.Screen
                name="GroupOwnerEditorScreen"
                component={GroupOwnerEditorScreen}
                options={{ headerShown: false }} />
              <Stack.Screen
                name="ManageMembersScreen"
                component={ManageMembersScreen}
                options={{ headerShown: false }} />
              <Stack.Screen
                name="AddMembersScreen"
                component={AddMembersScreen}
                options={{ headerShown: false }} />
              <Stack.Screen
                name="GroupSearchScreen"
                component={GroupSearchScreen}
                options={{
                  title: 'Search Group',
                  headerStyle: { backgroundColor: context.theme.current.background.Normal },
                  headerTintColor: context.theme.current.surface.On,
                }} />
              <Stack.Screen name="CreateGroupScreen" component={CreateGroupScreen} options={{ headerShown: false }} />
              <Stack.Screen name="NewFriendsScreen" component={NewFriendsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="BlockedListScreen" component={BlockedListScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </AppContext.Provider>
      </PaperProvider>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  }
});

export default App;
