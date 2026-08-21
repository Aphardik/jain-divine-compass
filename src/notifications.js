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

// Schedules a repeating local notification at { hour, minute } (24h).
// `weekdays`, if given, is an array of 1-7 (Sunday=1 … Saturday=7, matching
// expo-notifications' calendar trigger) restricting the reminder to those
// days — one trigger is scheduled per day since a single trigger can't hold
// more than one weekday. Omit/empty `weekdays` for a plain daily reminder.
// Returns an array of notification ids (to cancel later), or null if
// unavailable.
export async function schedulePrayerNotification({ hour, minute, title, body, weekdays }) {
  if (!Notifications) return null;
  try {
    const granted = await ensureNotificationPermission();
    if (!granted) return null;
    const content = { title, body, sound: NOTIFICATION_SOUND };
    if (!weekdays || weekdays.length === 0) {
      const id = await Notifications.scheduleNotificationAsync({
        content,
        trigger: { hour, minute, repeats: true, channelId: CHANNEL_ID },
      });
      return [id];
    }
    return await Promise.all(
      weekdays.map((weekday) =>
        Notifications.scheduleNotificationAsync({
          content,
          trigger: { weekday, hour, minute, repeats: true, channelId: CHANNEL_ID },
        })
      )
    );
  } catch (e) {
    return null;
  }
}

// Accepts a single id or an array of ids (a day-restricted reminder holds
// one id per selected weekday).
export async function cancelPrayerNotification(notificationIds) {
  if (!Notifications || !notificationIds) return;
  const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
  await Promise.all(
    ids.map((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => {}))
  );
}

export function notificationsAvailable() {
  return !!Notifications;
}
