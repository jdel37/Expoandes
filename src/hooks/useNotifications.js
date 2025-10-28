import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export const useNotifications = () => {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  const sendLocalNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  return { sendLocalNotification };
};
