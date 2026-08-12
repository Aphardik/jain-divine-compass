import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

import { DEFAULT_LANGUAGE, REGIONS, translate } from './src/i18n';
import { TIRTHS } from './src/tirths';
import { getColors } from './src/theme';
import { makeStyles } from './src/styles';
import {
  calculateBearing,
  calculateDistance,
  compassLabel,
  fmtCoord,
  fmtDistance,
  shortestDelta,
} from './src/geo';
import { STORAGE_KEYS, getJSON, getString, setJSON, setString } from './src/storage';
import {
  cancelPrayerNotification,
  ensureNotificationPermission,
  schedulePrayerNotification,
  sendTestNotification,
} from './src/notifications';

import CompassDial from './src/components/CompassDial';
import Needle from './src/components/Needle';
import SettingsModal from './src/components/SettingsModal';
import TimePickerModal from './src/components/TimePickerModal';
import MilestoneSheet from './src/components/MilestoneSheet';
import PrayerOverlay from './src/components/PrayerOverlay';

// This build is dedicated to a single tirth (Shatrunjaya) — see src/tirths.js.
const TARGET = TIRTHS[0];

// Optional haptics — degrade gracefully if the module isn't installed.
let Haptics = null;
try {
  // eslint-disable-next-line global-require
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

const { width } = Dimensions.get('window');
const DIAL_SIZE = Math.min(width * 0.86, 360);

const DEFAULT_PRAYER_TIMES = [
  { id: 'default-morning', hour: 7, minute: 0, enabled: true, notificationId: null },
];

export default function App() {
  const [booted, setBooted] = useState(false);
  // Defaults to Hindi and skips any first-launch chooser — language is only
  // ever changed from Settings now.
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [theme, setTheme] = useState('light');

  const [heading, setHeading] = useState(0);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [ready, setReady] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const target = TARGET;
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Prayer-time reminders (Settings) + the milestone/anniversary banner.
  const [prayerTimes, setPrayerTimes] = useState(DEFAULT_PRAYER_TIMES);
  const [dismissedMilestones, setDismissedMilestones] = useState({});
  const [milestoneVisible, setMilestoneVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  // Full-screen Navkar Mantra reveal, shown once the compass aligns.
  const [prayerOverlayVisible, setPrayerOverlayVisible] = useState(false);

  const needleRotation = useRef(new Animated.Value(0)).current;
  const dialRotation = useRef(new Animated.Value(0)).current;
  const currentNeedleAngle = useRef(0);
  const currentDialAngle = useRef(0);
  const wasAligned = useRef(false);
  const alignmentShown = useRef(false);

  const c = useMemo(() => getColors(theme), [theme]);
  const styles = useMemo(() => makeStyles(c), [c]);
  const t = (key, vars) => translate(language, key, vars);

  // Load saved preferences on first render.
  useEffect(() => {
    (async () => {
      try {
        const savedLang = await getString(STORAGE_KEYS.LANGUAGE);
        const savedTheme = await getString(STORAGE_KEYS.THEME);
        const savedPrayerTimes = await getJSON(STORAGE_KEYS.PRAYER_TIMES, null);
        const savedDismissed = await getJSON(STORAGE_KEYS.DISMISSED_MILESTONES, {});
        if (savedLang) setLanguage(savedLang);
        if (savedTheme) setTheme(savedTheme);
        if (savedPrayerTimes) {
          setPrayerTimes(savedPrayerTimes);
        } else {
          setJSON(STORAGE_KEYS.PRAYER_TIMES, DEFAULT_PRAYER_TIMES);
        }
        setDismissedMilestones(savedDismissed || {});
      } catch (e) {}
      setBooted(true);
    })();
  }, []);

  // Start location/heading once saved preferences have loaded (kept off
  // `language` so a saved language loading in after boot doesn't tear down
  // and resubscribe the location/heading watchers).
  useEffect(() => {
    if (!booted) return undefined;
    let headingSub;
    let locationSub;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(translate(language, 'permission'));
        return;
      }
      const initial = await Location.getCurrentPositionAsync({});
      setLocation(initial.coords);
      setReady(true);

      locationSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 3000, distanceInterval: 5 },
        (loc) => setLocation(loc.coords)
      );
      headingSub = await Location.watchHeadingAsync((h) => {
        setHeading(h.trueHeading >= 0 ? h.trueHeading : h.magHeading);
        if (typeof h.accuracy === 'number') setAccuracy(h.accuracy);
      });
    })();

    return () => {
      if (headingSub) headingSub.remove();
      if (locationSub) locationSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  // Show the tirth's anniversary/milestone banner once, the first time the
  // app is opened after install.
  useEffect(() => {
    if (!booted) return;
    if (target.milestone && !dismissedMilestones[target.milestone.id]) {
      setMilestoneVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  const bearing = location
    ? calculateBearing(location.latitude, location.longitude, target.latitude, target.longitude)
    : 0;
  const distanceKm = location
    ? calculateDistance(location.latitude, location.longitude, target.latitude, target.longitude)
    : null;
  const relative = shortestDelta(heading, bearing);
  const aligned = ready && Math.abs(relative) <= 4;

  // Aligned transition: haptic tick + open the full-screen prayer reveal
  // (once per alignment session — moving away and re-aligning shows it again).
  useEffect(() => {
    if (aligned && !wasAligned.current) {
      if (Haptics) {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {}
      }
      if (!alignmentShown.current) {
        alignmentShown.current = true;
        setPrayerOverlayVisible(true);
      }
    }
    if (!aligned) {
      alignmentShown.current = false;
    }
    wasAligned.current = aligned;
  }, [aligned]);

  useEffect(() => {
    const targetNeedleAngle = bearing - heading;
    const delta = shortestDelta(currentNeedleAngle.current % 360, targetNeedleAngle);
    currentNeedleAngle.current += delta;
    Animated.timing(needleRotation, {
      toValue: currentNeedleAngle.current,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    const targetDialAngle = -heading;
    const dialDelta = shortestDelta(currentDialAngle.current % 360, targetDialAngle);
    currentDialAngle.current += dialDelta;
    Animated.timing(dialRotation, {
      toValue: currentDialAngle.current,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [heading, bearing]);

  const needleSpin = needleRotation.interpolate({
    inputRange: [-3600, 3600],
    outputRange: ['-3600deg', '3600deg'],
  });
  const dialSpin = dialRotation.interpolate({
    inputRange: [-3600, 3600],
    outputRange: ['-3600deg', '3600deg'],
  });

  async function chooseLanguage(code) {
    setLanguage(code);
    await setString(STORAGE_KEYS.LANGUAGE, code);
  }
  async function chooseTheme(next) {
    setTheme(next);
    await setString(STORAGE_KEYS.THEME, next);
  }

  function updatePrayerTimes(next) {
    setPrayerTimes(next);
    setJSON(STORAGE_KEYS.PRAYER_TIMES, next);
  }

  async function handleAddPrayerTime() {
    setTimePickerVisible(true);
  }

  async function handleSavePrayerTime(hour, minute) {
    const granted = await ensureNotificationPermission();
    let notificationId = null;
    if (granted) {
      notificationId = await schedulePrayerNotification({
        hour,
        minute,
        title: t('prayerNotifTitle'),
        body: t('prayerNotifBody'),
      });
    }
    const id = `${Date.now()}`;
    updatePrayerTimes([...prayerTimes, { id, hour, minute, enabled: true, notificationId }]);
    setTimePickerVisible(false);
  }

  async function handleTogglePrayerTime(id) {
    const entry = prayerTimes.find((p) => p.id === id);
    if (!entry) return;
    if (entry.enabled) {
      await cancelPrayerNotification(entry.notificationId);
      updatePrayerTimes(
        prayerTimes.map((p) => (p.id === id ? { ...p, enabled: false, notificationId: null } : p))
      );
    } else {
      const granted = await ensureNotificationPermission();
      const notificationId = granted
        ? await schedulePrayerNotification({
            hour: entry.hour,
            minute: entry.minute,
            title: t('prayerNotifTitle'),
            body: t('prayerNotifBody'),
          })
        : null;
      updatePrayerTimes(
        prayerTimes.map((p) => (p.id === id ? { ...p, enabled: true, notificationId } : p))
      );
    }
  }

  async function handleRemovePrayerTime(id) {
    const entry = prayerTimes.find((p) => p.id === id);
    if (entry && entry.enabled) await cancelPrayerNotification(entry.notificationId);
    updatePrayerTimes(prayerTimes.filter((p) => p.id !== id));
  }

  function markMilestoneDismissed(milestoneId) {
    const next = { ...dismissedMilestones, [milestoneId]: true };
    setDismissedMilestones(next);
    setJSON(STORAGE_KEYS.DISMISSED_MILESTONES, next);
  }

  function handleMilestoneDecline() {
    if (target.milestone) markMilestoneDismissed(target.milestone.id);
    setMilestoneVisible(false);
  }

  function handleMilestoneAccept() {
    if (target.milestone) markMilestoneDismissed(target.milestone.id);
    setMilestoneVisible(false);
    setTimePickerVisible(true);
  }

  if (!booted) {
    return <LinearGradient colors={c.gradient} style={styles.container} />;
  }

  const nm = target.name[language] || target.name.en;
  const place = (target.place && (target.place[language] || target.place.en)) || '';
  const rg = REGIONS[target.region][language] || REGIONS[target.region].en;

  return (
    <LinearGradient colors={c.gradient} style={styles.container}>
      <StatusBar style={c.isDark ? 'light' : 'dark'} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => chooseTheme(theme === 'dark' ? 'light' : 'dark')}
          hitSlop={10}
          style={styles.topBtn}
        >
          <Text style={styles.topBtnIcon}>{theme === 'dark' ? '☀' : '☾'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSettingsOpen(true)} hitSlop={10} style={styles.topBtn}>
          <Text style={styles.topBtnIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>✦  {t('pranam')}  ✦</Text>
        <View style={styles.tirthCard}>
          <Text style={styles.tirthName} numberOfLines={1}>
            {nm}
          </Text>
        </View>
        {!!place && (
          <Text style={styles.placeLine}>
            {place} · {rg}
          </Text>
        )}
        <Text style={styles.coords}>
          {fmtCoord(target.latitude, 'N', 'S')}   {fmtCoord(target.longitude, 'E', 'W')}
        </Text>
      </View>

      {/* Compass */}
      <View style={styles.dialWrap}>
        <View
          style={[
            styles.glowRing,
            {
              width: DIAL_SIZE + 34,
              height: DIAL_SIZE + 34,
              borderRadius: (DIAL_SIZE + 34) / 2,
              borderColor: aligned ? c.alignGlow : c.glowRing,
            },
          ]}
        />
        <Animated.View style={{ transform: [{ rotate: dialSpin }] }}>
          <CompassDial size={DIAL_SIZE} bearing={bearing} aligned={aligned} colors={c} />
        </Animated.View>

        <View style={[styles.topNotch, aligned && { borderTopColor: c.align }]} />

        <Animated.View
          style={[
            styles.needleWrap,
            { width: DIAL_SIZE, height: DIAL_SIZE, transform: [{ rotate: needleSpin }] },
          ]}
        >
          <Needle size={DIAL_SIZE} aligned={aligned} colors={c} />
        </Animated.View>

        <View style={[styles.centerHub, aligned && { borderColor: c.align }]}>
          <Text style={[styles.headingDeg, aligned && { color: c.align }]}>
            {Math.round(((heading % 360) + 360) % 360)}°
          </Text>
          <Text style={styles.headingCard}>{compassLabel(heading)}</Text>
        </View>
      </View>

      {/* Status pill */}
      <View style={[styles.statusPill, aligned && styles.statusPillOn]}>
        <Text style={[styles.statusText, aligned && { color: c.align }]}>
          {!ready
            ? t('locating')
            : aligned
            ? `✓  ${t('alignedMsg')} 🙏`
            : `${relative > 0 ? t('turnRight') : t('turnLeft')}  ${
                relative > 0 ? '↻' : '↺'
              }  ${Math.abs(Math.round(relative))}°`}
        </Text>
      </View>

      {/* Info card */}
      <View style={styles.infoCard}>
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <>
            <InfoRow
              styles={styles}
              label={t('directionToTirth')}
              value={`${compassLabel(bearing)} · ${bearing.toFixed(0)}°`}
            />
            <View style={styles.divider} />
            <InfoRow styles={styles} label={t('distance')} value={fmtDistance(distanceKm)} />
            <View style={styles.divider} />
            <InfoRow
              styles={styles}
              label={t('accuracy')}
              value={
                accuracy == null
                  ? '—'
                  : accuracy <= 1
                  ? t('high')
                  : accuracy === 2
                  ? t('medium')
                  : t('low')
              }
            />
          </>
        )}
      </View>

      <Text style={styles.footerNote}>{t('footer')}</Text>

      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        language={language}
        theme={theme}
        onLanguage={chooseLanguage}
        onTheme={chooseTheme}
        prayerTimes={prayerTimes}
        onTogglePrayerTime={handleTogglePrayerTime}
        onRemovePrayerTime={handleRemovePrayerTime}
        onAddPrayerTime={handleAddPrayerTime}
        onTestNotification={sendTestNotification}
        colors={c}
        styles={styles}
        t={t}
      />

      <MilestoneSheet
        visible={milestoneVisible}
        tirth={target}
        language={language}
        colors={c}
        styles={styles}
        t={t}
        onDecline={handleMilestoneDecline}
        onAccept={handleMilestoneAccept}
      />

      <TimePickerModal
        visible={timePickerVisible}
        initialHour={7}
        initialMinute={0}
        onCancel={() => setTimePickerVisible(false)}
        onSave={handleSavePrayerTime}
        styles={styles}
        t={t}
      />

      <PrayerOverlay
        visible={prayerOverlayVisible}
        tirthName={nm}
        praiseVerse={target.praiseVerse}
        language={language}
        styles={styles}
        onClose={() => setPrayerOverlayVisible(false)}
      />
    </LinearGradient>
  );
}

function InfoRow({ label, value, styles }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}
