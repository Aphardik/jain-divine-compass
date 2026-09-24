import { Platform } from 'react-native';
import * as Location from 'expo-location';

// Cross-platform device-heading subscription. Native (iOS/Android) has a real
// magnetometer via expo-location; browsers don't expose one uniformly, so web
// falls back to the DeviceOrientationEvent API on a best-effort basis — it
// works on most mobile browsers but resolves to a permanent no-op when the
// API, or an absolute/compass heading within it, isn't available (desktop
// browsers, older browsers, denied permission).
//
// callback receives { heading: number (0-360), accuracy: number|null }.
// Always resolves to a subscription-like object with .remove().
export async function watchHeading(callback) {
  if (Platform.OS !== 'web') {
    return Location.watchHeadingAsync((h) => {
      callback({
        heading: h.trueHeading >= 0 ? h.trueHeading : h.magHeading,
        accuracy: typeof h.accuracy === 'number' ? h.accuracy : null,
      });
    });
  }
  return watchHeadingWeb(callback);
}

function watchHeadingWeb(callback) {
  if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
    return Promise.resolve({ remove() {} });
  }

  const handler = (event) => {
    // iOS Safari: non-standard property giving compass heading directly
    // (0 = true north, increases clockwise) — no calibration step needed.
    if (typeof event.webkitCompassHeading === 'number') {
      callback({ heading: event.webkitCompassHeading, accuracy: null });
      return;
    }
    // Standard API: only trustworthy once referenced to absolute north
    // (Chrome/Android's `deviceorientationabsolute` event, or `absolute:
    // true` on `deviceorientation`) — otherwise alpha is relative to
    // whichever way the device happened to be facing on load. Alpha also
    // increases counter-clockwise, opposite of compass bearings.
    if (typeof event.alpha === 'number' && event.absolute) {
      callback({ heading: (360 - event.alpha) % 360, accuracy: null });
    }
  };

  const attach = () => {
    const eventName =
      'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
    window.addEventListener(eventName, handler);
    return eventName;
  };

  // iOS 13+ Safari requires this to be called (and granted) before
  // `deviceorientation` reports any data — and, per Apple's docs, from
  // within a user gesture. Called here at boot with no gesture behind it,
  // so on iOS Safari this typically resolves 'denied' and the compass stays
  // static; every other browser ignores this API and just gets events.
  const requestPermission = window.DeviceOrientationEvent.requestPermission;
  if (typeof requestPermission === 'function') {
    return requestPermission()
      .then((state) => {
        if (state !== 'granted') return { remove() {} };
        const eventName = attach();
        return { remove: () => window.removeEventListener(eventName, handler) };
      })
      .catch(() => ({ remove() {} }));
  }

  const eventName = attach();
  return Promise.resolve({ remove: () => window.removeEventListener(eventName, handler) });
}
