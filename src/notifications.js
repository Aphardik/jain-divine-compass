// Optional local notifications for daily prayer-time reminders — degrade
// gracefully (no crash, reminders just won't fire) if the module or a dev
// build isn't available, same pattern as Haptics/AsyncStorage in this app.
//
// Android freezes a channel's sound/importance/vibration the first time it's
// created — later calls to setNotificationChannelAsync silently can't change
// them on an existing install. Bump this ID (e.g. -v3, -v4) any time those
// settings change, so Android creates a fresh channel instead of reusing a
// stale one.
const CHANNEL_ID = 'prayer-reminders-v3';
// Must match the basename of the file listed in the expo-notifications
// plugin's `sounds` array in app.json. Only takes effect in a
// development/production build — Expo Go always falls back to the OS
// default sound.
const NOTIFICATION_SOUND = 'notification.mp3';

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
  //
  // usage: ALARM routes playback through the Alarm audio stream instead of
  // Notification. Verified via `adb shell dumpsys notification` that the
  // channel's sound URI was already correctly set to our custom raw
  // resource, but some OEM notification-management layers (confirmed here:
  // OxygenOS/ColorOS tags this app's notifications with an internal
  // groupKey=silent, muting anything on the Notification stream regardless
  // of channel config) mute the Notification stream for apps they don't
  // trust yet. The Alarm stream is normally exempt from that throttling.
  Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Prayer Reminders',
    importance: Notifications.AndroidImportance.MAX,
    sound: NOTIFICATION_SOUND,
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
    },
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
      content: { title, body, sound: NOTIFICATION_SOUND },
      trigger: { hour, minute, repeats: true, channelId: CHANNEL_ID },
    });
  } catch (e) {
    return null;
  }
}

// Temporary debug helper — fires almost immediately on the same channel so
// the custom sound can be tested from the foreground without waiting for a
// real scheduled reminder. Safe to remove once sound issues are resolved.
export async function sendTestNotification() {
  if (!Notifications) return null;
  try {
    const granted = await ensureNotificationPermission();
    if (!granted) return null;
    return await Notifications.scheduleNotificationAsync({
      content: { title: 'Test notification', body: 'Custom sound check', sound: NOTIFICATION_SOUND },
      trigger: { seconds: 2, channelId: CHANNEL_ID },
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
