import notifee, { EventType, AndroidImportance, AndroidStyle, AndroidColor, AndroidVisibility } from '@notifee/react-native';
import { PermissionsAndroid } from 'react-native';

export async function displayNotification(title: string, body: string, time: string) {
    // await notifee.requestPermission();

    await PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');
    // 前台后台都显示
    await PermissionsAndroid.request('android.permission.ACCESS_BACKGROUND_LOCATION');
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'app-notification-channel',
        name: 'App',
        importance: AndroidImportance.HIGH, // Ensure the importance is set to high
        visibility: AndroidVisibility.PUBLIC, // Ensure the visibility is set to public
        badge: true,
    });

    // Display a notification
    await notifee.displayNotification({
        title: title,
        body: body.length > 18 ? body.substring(0, 18) + '...' : body,
        subtitle: time,
        android: {
            channelId,
            smallIcon: 'ic_launcher', // Ensure you have this icon in your resources
            importance: AndroidImportance.HIGH, // High importance for heads-up notifications
            fullScreenAction: { // Set full screen action to ensure heads-up display
                id: 'default',
            },
            showTimestamp: true,
            timestamp: Date.now(),
        },
    });
}