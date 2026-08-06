// Optional local notifications for daily prayer-time reminders — degrade
// gracefully (no crash, reminders just won't fire) if the module or a dev
// build isn't available, same pattern as Haptics/AsyncStorage in this app.
const CHANNEL_ID = 'prayer-reminders';

let Notifications = null;
try {
  // eslint-disable-next-line global-require
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  // Android ignores shouldPlaySound above unless the notification is posted
  // to a channel that itself has a sound configured — without this, Android
  // silently falls back to its auto-created "default" channel (no sound).
  Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Prayer Reminders',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });
} catch (e) {
  Notifications = null;
}

export async function ensureNotificationPermission() {
  if (!Notifications) return false;
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    return false;
  }
}

// Schedules a daily-repeating local notification at { hour, minute } (24h).
// Returns the notification id (to cancel later), or null if unavailable.
export async function schedulePrayerNotification({ hour, minute, title, body }) {
  if (!Notifications) return null;
  try {
    const granted = await ensureNotificationPermission();
    if (!granted) return null;
    return await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: 'default' },
      trigger: { hour, minute, repeats: true, channelId: CHANNEL_ID },
    });
  } catch (e) {
    return null;
  }
}

export async function cancelPrayerNotification(notificationId) {
  if (!Notifications || !notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (e) {}
}

export function notificationsAvailable() {
  return !!Notifications;
}
