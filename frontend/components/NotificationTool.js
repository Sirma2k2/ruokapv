import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const NotificationTool = ({ initialNotificationValue }) => {
  const [isEnabled, setIsEnabled] = useState(initialNotificationValue);

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('daily-reminders', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission for notifications was denied');
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Log your food!",
        body: "Don't forget to log your food into the app today.",
        sound: 'default',
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);
    if (!isEnabled) {
      await scheduleNotification();
    } else {
      await cancelAllNotifications();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enable Daily Notifications</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
  },
});

export default NotificationTool;