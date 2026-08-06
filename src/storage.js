// Persistent storage — fall back to an in-memory store if the package is
// missing (e.g. running in a bare Expo Go before `npm install`).
let AsyncStorage;
try {
  // eslint-disable-next-line global-require
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  const mem = {};
  AsyncStorage = {
    getItem: async (k) => (k in mem ? mem[k] : null),
    setItem: async (k, v) => {
      mem[k] = v;
    },
  };
}

export const STORAGE_KEYS = {
  LANGUAGE: 'spiritual.language',
  THEME: 'spiritual.theme',
  PRAYER_TIMES: 'spiritual.prayerTimes',
  DISMISSED_MILESTONES: 'spiritual.dismissedMilestones',
};

export async function getString(key) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export async function setString(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {}
}

export async function getJSON(key, fallback) {
  const raw = await getString(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

export async function setJSON(key, value) {
  await setString(key, JSON.stringify(value));
}

export default AsyncStorage;
