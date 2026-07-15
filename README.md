# Sacred Direction — Spiritual Compass App

A cross-platform (Android + iOS) mobile app built with **React Native (Expo)**.
It shows a classy, gold-on-deep-purple compass whose needle always points toward
one fixed sacred coordinate:

```
21°28'58"N   71°47'42"E   (21.482778, 71.795)
```

It also shows live distance and bearing to that point, using your phone's GPS
and magnetometer/compass sensor.

---

## Why you can't just "download" it right now

I can hand you the full, working source code (done — it's in this folder), but
an actual installable **.apk** (Android) or **.ipa** (iOS) has to be compiled by
a real build service using your own free Expo/Apple accounts — I don't have
access to Google Play / Apple's build infrastructure from here. The good news:
this takes about 10–15 minutes and needs **zero** Android Studio / Xcode setup.

There are two paths below — pick one.

---

## Option A — Fastest: test it live in 2 minutes (no build needed)

1. On your phone, install the **Expo Go** app (free, Play Store / App Store).
2. On your computer, install Node.js (nodejs.org) if you don't have it.
3. Unzip this project, then in a terminal:
   ```bash
   cd spiritual-compass
   npm install
   npx expo start
   ```
4. A QR code appears in the terminal / browser tab.
   - **Android**: open Expo Go → scan the QR code.
   - **iOS**: open the Camera app → scan the QR code → it opens in Expo Go.
5. The compass app loads on your phone instantly. Grant location permission
   when asked.

This is perfect for trying it out. The only downside: your computer needs to
stay running `expo start` while you use it (same Wi-Fi network).

---

## Option B — Get a real, installable app file (APK for Android)

This builds an actual `.apk` you can install permanently, no computer needed
afterward.

1. Create a free account at https://expo.dev
2. In the project folder:
   ```bash
   npm install
   npm install -g eas-cli
   eas login
   eas build:configure
   eas build -p android --profile preview
   ```
3. This uploads your code to Expo's cloud build servers and compiles a real
   APK (takes ~10 min). When done, it gives you a **download link**.
4. Open that link on your Android phone → tap the downloaded `.apk` → allow
   "install from unknown sources" if asked → Install.

### For iOS (.ipa)
Apple requires a paid Apple Developer account ($99/year) to install a custom
app on a real iPhone outside the App Store. If you have one:
```bash
eas build -p ios --profile preview
```
Without a developer account, use **Option A (Expo Go)** to run it on iPhone
instead — it works identically for testing/daily use.

---

## Project structure

```
spiritual-compass/
├── App.js            ← all the compass UI + GPS/heading logic
├── app.json           ← app name, icon, splash, permissions config
├── package.json        ← dependencies
├── babel.config.js
└── assets/
    ├── icon.png
    ├── adaptive-icon.png
    ├── splash.png
    └── favicon.png
```

## Changing the sacred point

Open `App.js`, near the top:

```js
const TARGET = {
  latitude: 21.482778,
  longitude: 71.795,
  label: 'Sacred Point',
};
```

Change `latitude`, `longitude`, and `label` to point anywhere else.

## Notes

- The compass needs a real device (magnetometer) — it won't show a moving
  needle on a desktop web browser or most simulators.
- If the needle seems inaccurate right after opening, wave the phone in a
  slow figure-8 — this calibrates the magnetometer (a standard compass-app
  behavior on Android/iOS).
- Location permission is required for distance/bearing calculation.
