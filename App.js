import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Dimensions,
  Platform,
  Modal,
  FlatList,
  TextInput,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Circle,
  Line,
  Text as SvgText,
  G,
  Path,
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

// Optional haptics — degrade gracefully if the module isn't installed.
let Haptics = null;
try {
  // eslint-disable-next-line global-require
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

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

const STORE_LANG = 'spiritual.language';
const STORE_THEME = 'spiritual.theme';

// ---------------------------------------------------------------------------
// LANGUAGES
// ---------------------------------------------------------------------------
const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिन्दी' },
  { code: 'gu', native: 'ગુજરાતી' },
];

// ---------------------------------------------------------------------------
// REGION names (localised)
// ---------------------------------------------------------------------------
const REGIONS = {
  gujarat: { en: 'Gujarat', hi: 'गुजरात', gu: 'ગુજરાત' },
  rajasthan: { en: 'Rajasthan', hi: 'राजस्थान', gu: 'રાજસ્થાન' },
  jharkhand: { en: 'Jharkhand', hi: 'झारखंड', gu: 'ઝારખંડ' },
  bihar: { en: 'Bihar', hi: 'बिहार', gu: 'બિહાર' },
  karnataka: { en: 'Karnataka', hi: 'कर्नाटक', gu: 'કર્ણાટક' },
  up: { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', gu: 'ઉત્તર પ્રદેશ' },
  telangana: { en: 'Telangana', hi: 'तेलंगाना', gu: 'તેલંગાણા' },
  mp: { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश', gu: 'મધ્ય પ્રદેશ' },
};

// ---------------------------------------------------------------------------
// JAIN TIRTH STHALS — sacred pilgrimage points.
// Coordinates are of the main temple / sanctum.
// ---------------------------------------------------------------------------
const TIRTHS = [
  {
    id: 'shatrunjaya',
    name: { en: 'Shatrunjaya (Palitana)', hi: 'शत्रुंजय (पालीताणा)', gu: 'શત્રુંજય (પાલિતાણા)' },
    region: 'gujarat',
    latitude: 21.482778,
    longitude: 71.795,
  },
  {
    id: 'girnar',
    name: { en: 'Girnar', hi: 'गिरनार', gu: 'ગિરનાર' },
    region: 'gujarat',
    latitude: 21.5222,
    longitude: 70.4579,
  },
  {
    id: 'shikharji',
    name: { en: 'Sammed Shikharji', hi: 'सम्मेद शिखरजी', gu: 'સમ્મેદ શિખરજી' },
    region: 'jharkhand',
    latitude: 23.9629,
    longitude: 86.1378,
  },
  {
    id: 'dilwara',
    name: { en: 'Dilwara (Mount Abu)', hi: 'दिलवाड़ा (माउंट आबू)', gu: 'દેલવાડા (માઉન્ટ આબુ)' },
    region: 'rajasthan',
    latitude: 24.6033,
    longitude: 72.7241,
  },
  {
    id: 'ranakpur',
    name: { en: 'Ranakpur', hi: 'राणकपुर', gu: 'રાણકપુર' },
    region: 'rajasthan',
    latitude: 25.1163,
    longitude: 73.4712,
  },
  {
    id: 'kesariyaji',
    name: { en: 'Kesariyaji (Rishabhdeo)', hi: 'केसरियाजी (ऋषभदेव)', gu: 'કેસરિયાજી (ઋષભદેવ)' },
    region: 'rajasthan',
    latitude: 24.114,
    longitude: 73.689,
  },
  {
    id: 'nakoda',
    name: { en: 'Nakoda', hi: 'नाकोड़ा', gu: 'નાકોડા' },
    region: 'rajasthan',
    latitude: 25.8622,
    longitude: 72.064,
  },
  {
    id: 'taranga',
    name: { en: 'Taranga', hi: 'तारंगा', gu: 'તારંગા' },
    region: 'gujarat',
    latitude: 23.9645,
    longitude: 72.7561,
  },
  {
    id: 'pavapuri',
    name: { en: 'Pavapuri', hi: 'पावापुरी', gu: 'પાવાપુરી' },
    region: 'bihar',
    latitude: 25.0876,
    longitude: 85.6006,
  },
  {
    id: 'rajgir',
    name: { en: 'Rajgir', hi: 'राजगीर', gu: 'રાજગીર' },
    region: 'bihar',
    latitude: 25.029,
    longitude: 85.42,
  },
  {
    id: 'champapuri',
    name: { en: 'Champapuri', hi: 'चंपापुरी', gu: 'ચંપાપુરી' },
    region: 'bihar',
    latitude: 25.245,
    longitude: 86.93,
  },
  {
    id: 'shravanabelagola',
    name: { en: 'Shravanabelagola', hi: 'श्रवणबेलगोला', gu: 'શ્રવણબેલગોળા' },
    region: 'karnataka',
    latitude: 12.8574,
    longitude: 76.4899,
  },
  {
    id: 'mahavirji',
    name: { en: 'Shri Mahavirji', hi: 'श्री महावीरजी', gu: 'શ્રી મહાવીરજી' },
    region: 'rajasthan',
    latitude: 26.7975,
    longitude: 76.9744,
  },
  {
    id: 'hastinapur',
    name: { en: 'Hastinapur', hi: 'हस्तिनापुर', gu: 'હસ્તિનાપુર' },
    region: 'up',
    latitude: 29.162,
    longitude: 78.012,
  },
  {
    id: 'kulpakji',
    name: { en: 'Kulpakji', hi: 'कुलपाकजी', gu: 'કુલપાકજી' },
    region: 'telangana',
    latitude: 17.5561,
    longitude: 78.98,
  },
  {
    id: 'bawangaja',
    name: { en: 'Bawangaja', hi: 'बावनगजा', gu: 'બાવનગજા' },
    region: 'mp',
    latitude: 21.993,
    longitude: 74.885,
  },
];

// ---------------------------------------------------------------------------
// TRANSLATIONS
// ---------------------------------------------------------------------------
const STRINGS = {
  en: {
    tagline: 'Sacred Direction',
    greeting: 'JAI JINENDRA',
    selectLanguage: 'Select Language',
    languageHint: 'You can change this later in Settings',
    continue: 'Continue',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    done: 'Done',
    chooseTirth: 'Choose a Tirth',
    search: 'Search tirth or region…',
    nearest: 'Nearest',
    noMatch: 'No tirth matches your search.',
    directionToTirth: 'Direction to tirth',
    distance: 'Distance',
    accuracy: 'Compass accuracy',
    high: 'High',
    medium: 'Medium',
    low: 'Low — calibrate',
    locating: 'Locating you…',
    alignedMsg: 'Facing the tirth — bow your head',
    turnLeft: 'Turn left',
    turnRight: 'Turn right',
    footer: 'Hold the phone flat. If the needle drifts, wave it in a figure-8 to calibrate.',
    permission:
      'Location permission was not granted. Please enable it in Settings to use the compass.',
  },
  hi: {
    tagline: 'तीर्थ दिशा',
    greeting: 'जय जिनेन्द्र',
    selectLanguage: 'भाषा चुनें',
    languageHint: 'इसे बाद में सेटिंग्स में बदल सकते हैं',
    continue: 'आगे बढ़ें',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    theme: 'थीम',
    dark: 'गहरा',
    light: 'हल्का',
    done: 'हो गया',
    chooseTirth: 'तीर्थ चुनें',
    search: 'तीर्थ या क्षेत्र खोजें…',
    nearest: 'निकटतम',
    noMatch: 'कोई तीर्थ नहीं मिला।',
    directionToTirth: 'तीर्थ की दिशा',
    distance: 'दूरी',
    accuracy: 'कम्पास सटीकता',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'निम्न — कैलिब्रेट करें',
    locating: 'आपका स्थान खोजा जा रहा है…',
    alignedMsg: 'तीर्थ की ओर — शीश झुकाएँ',
    turnLeft: 'बाएँ घूमें',
    turnRight: 'दाएँ घूमें',
    footer: 'फ़ोन को समतल रखें। सुई अस्थिर हो तो इसे 8 के आकार में घुमाएँ।',
    permission:
      'स्थान की अनुमति नहीं मिली। कृपया कम्पास उपयोग हेतु सेटिंग्स में इसे सक्षम करें।',
  },
  gu: {
    tagline: 'તીર્થ દિશા',
    greeting: 'જય જિનેન્દ્ર',
    selectLanguage: 'ભાષા પસંદ કરો',
    languageHint: 'આ પછીથી સેટિંગ્સમાં બદલી શકો છો',
    continue: 'આગળ વધો',
    settings: 'સેટિંગ્સ',
    language: 'ભાષા',
    theme: 'થીમ',
    dark: 'ઘેરો',
    light: 'હળવો',
    done: 'થઈ ગયું',
    chooseTirth: 'તીર્થ પસંદ કરો',
    search: 'તીર્થ કે પ્રદેશ શોધો…',
    nearest: 'નજીકનું',
    noMatch: 'કોઈ તીર્થ મળ્યું નથી.',
    directionToTirth: 'તીર્થની દિશા',
    distance: 'અંતર',
    accuracy: 'હોકાયંત્ર ચોકસાઈ',
    high: 'ઊંચી',
    medium: 'મધ્યમ',
    low: 'ઓછી — કેલિબ્રેટ કરો',
    locating: 'તમારું સ્થાન શોધાઈ રહ્યું છે…',
    alignedMsg: 'તીર્થ સન્મુખ — શીશ ઝુકાવો',
    turnLeft: 'ડાબે ફરો',
    turnRight: 'જમણે ફરો',
    footer: 'ફોન સપાટ રાખો. સોય અસ્થિર હોય તો તેને 8 ના આકારમાં ફેરવો.',
    permission:
      'સ્થાનની પરવાનગી મળી નથી. કૃપા કરી હોકાયંત્ર વાપરવા સેટિંગ્સમાં તેને ચાલુ કરો.',
  },
};

// ---------------------------------------------------------------------------
// THEME palettes
// ---------------------------------------------------------------------------
function getColors(theme) {
  if (theme === 'light') {
    return {
      isDark: false,
      gradient: ['#fdf6e3', '#f6e8c8', '#efdcb4'],
      gold: '#b8860b',
      goldBright: '#9a6f08',
      text: '#3a2a12',
      textMuted: '#7a6a4a',
      align: '#2e9c63',
      cardinalN: '#c0392b',
      dialStops: ['#fff6df', '#f3e2bb', '#e6d0a0'],
      hubBg: 'rgba(255,250,238,0.94)',
      ringStroke: '#b8860b',
      innerStroke: '#d9c084',
      centerRingStroke: '#e0cb96',
      tickMajor: '#9a6f08',
      tickMid: '#b8934a',
      tickMinor: '#cbb277',
      degLabel: '#8a6f38',
      petal: '#c9a24a',
      cardBg: 'rgba(184,134,11,0.08)',
      cardBorder: 'rgba(184,134,11,0.30)',
      chipBg: 'rgba(184,134,11,0.06)',
      chipBorder: 'rgba(184,134,11,0.30)',
      chipTextOn: '#fdf6e3',
      glowRing: 'rgba(184,134,11,0.18)',
      alignGlow: 'rgba(46,156,99,0.40)',
      pillBg: 'rgba(184,134,11,0.08)',
      pillBorder: 'rgba(184,134,11,0.25)',
      pillOnBg: 'rgba(46,156,99,0.12)',
      pillOnBorder: 'rgba(46,156,99,0.5)',
      sheetBg: '#fbf3df',
      inputBg: 'rgba(184,134,11,0.07)',
      overlay: 'rgba(40,25,0,0.35)',
      needleTip: '#e0a92e',
      needleTip2: '#b8860b',
      needleTail: '#9a6f08',
      divider: 'rgba(184,134,11,0.15)',
      footer: '#a08a5c',
      rowBg: 'rgba(0,0,0,0.02)',
    };
  }
  // dark (default)
  return {
    isDark: true,
    gradient: ['#1a0f2e', '#160b1f', '#0d0614'],
    gold: '#e8c579',
    goldBright: '#ffd76b',
    text: '#fdf3da',
    textMuted: '#a99671',
    align: '#7be3a4',
    cardinalN: '#ff6b6b',
    dialStops: ['#2a1a40', '#1c1030', '#100a1e'],
    hubBg: 'rgba(16,10,30,0.92)',
    ringStroke: '#caa24a',
    innerStroke: '#6e5324',
    centerRingStroke: '#3a2c16',
    tickMajor: '#e8c579',
    tickMid: '#8a6d3b',
    tickMinor: '#5c4a2a',
    degLabel: '#b79a5e',
    petal: '#e8c579',
    cardBg: 'rgba(232,197,121,0.06)',
    cardBorder: 'rgba(232,197,121,0.22)',
    chipBg: 'rgba(232,197,121,0.05)',
    chipBorder: 'rgba(232,197,121,0.28)',
    chipTextOn: '#160b1f',
    glowRing: 'rgba(232,197,121,0.15)',
    alignGlow: 'rgba(123,227,164,0.45)',
    pillBg: 'rgba(232,197,121,0.08)',
    pillBorder: 'rgba(232,197,121,0.22)',
    pillOnBg: 'rgba(123,227,164,0.12)',
    pillOnBorder: 'rgba(123,227,164,0.5)',
    sheetBg: '#160b1f',
    inputBg: 'rgba(232,197,121,0.08)',
    overlay: 'rgba(0,0,0,0.6)',
    needleTip: '#ffe9a8',
    needleTip2: '#caa24a',
    needleTail: '#6e5324',
    divider: 'rgba(232,197,121,0.12)',
    footer: '#5f5540',
    rowBg: 'rgba(255,255,255,0.02)',
  };
}

const { width } = Dimensions.get('window');
const DIAL_SIZE = Math.min(width * 0.86, 360);

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

function calculateBearing(lat1, lon1, lat2, lon2) {
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const dLambda = toRad(lon2 - lon1);
  const y = Math.sin(dLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function compassLabel(deg) {
  const dirs = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  return dirs[Math.round(deg / 22.5) % 16];
}

function shortestDelta(from, to) {
  return ((to - from + 540) % 360) - 180;
}

function fmtDistance(km) {
  if (km == null) return '—';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 100) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}

function fmtCoord(value, posSym, negSym) {
  const sym = value >= 0 ? posSym : negSym;
  const v = Math.abs(value);
  const d = Math.floor(v);
  const mFloat = (v - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}°${m.toString().padStart(2, '0')}'${s
    .toString()
    .padStart(2, '0')}"${sym}`;
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const [language, setLanguage] = useState(null); // null until chosen
  const [theme, setTheme] = useState('dark');

  const [heading, setHeading] = useState(0);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [ready, setReady] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [target, setTarget] = useState(TIRTHS[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const needleRotation = useRef(new Animated.Value(0)).current;
  const dialRotation = useRef(new Animated.Value(0)).current;
  const currentNeedleAngle = useRef(0);
  const currentDialAngle = useRef(0);
  const wasAligned = useRef(false);

  const c = useMemo(() => getColors(theme), [theme]);
  const styles = useMemo(() => makeStyles(c), [c]);
  const t = (key) => (STRINGS[language] || STRINGS.en)[key];

  // Load saved preferences on first render.
  useEffect(() => {
    (async () => {
      try {
        const savedLang = await AsyncStorage.getItem(STORE_LANG);
        const savedTheme = await AsyncStorage.getItem(STORE_THEME);
        if (savedLang) setLanguage(savedLang);
        if (savedTheme) setTheme(savedTheme);
      } catch (e) {}
      setBooted(true);
    })();
  }, []);

  // Start location/heading once a language has been chosen.
  useEffect(() => {
    if (!language) return undefined;
    let headingSub;
    let locationSub;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(t('permission'));
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
  }, [language]);

  const bearing = location
    ? calculateBearing(location.latitude, location.longitude, target.latitude, target.longitude)
    : 0;
  const distanceKm = location
    ? calculateDistance(location.latitude, location.longitude, target.latitude, target.longitude)
    : null;
  const relative = shortestDelta(heading, bearing);
  const aligned = ready && Math.abs(relative) <= 4;

  useEffect(() => {
    if (aligned && !wasAligned.current && Haptics) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {}
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
    try {
      await AsyncStorage.setItem(STORE_LANG, code);
    } catch (e) {}
  }
  async function chooseTheme(next) {
    setTheme(next);
    try {
      await AsyncStorage.setItem(STORE_THEME, next);
    } catch (e) {}
  }

  if (!booted) {
    return <LinearGradient colors={c.gradient} style={styles.container} />;
  }

  // First-launch language gate.
  if (!language) {
    return <LanguageGate colors={c} onPick={chooseLanguage} />;
  }

  const nm = target.name[language] || target.name.en;
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
        <Text style={styles.eyebrow}>ॐ  {t('greeting')}  ॐ</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.tirthButton}
          onPress={() => setPickerOpen(true)}
        >
          <Text style={styles.tirthName} numberOfLines={1}>
            {nm}
          </Text>
          <Text style={styles.tirthChevron}>⌄</Text>
        </TouchableOpacity>
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

      <TirthPicker
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(tt) => {
          setTarget(tt);
          setPickerOpen(false);
        }}
        selectedId={target.id}
        location={location}
        language={language}
        colors={c}
        styles={styles}
        t={t}
      />

      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        language={language}
        theme={theme}
        onLanguage={chooseLanguage}
        onTheme={chooseTheme}
        colors={c}
        styles={styles}
        t={t}
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

// -------------------- Language Gate --------------------
function LanguageGate({ colors, onPick }) {
  const styles = makeStyles(colors);
  return (
    <LinearGradient colors={colors.gradient} style={styles.gateContainer}>
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      <Text style={styles.gateOm}>ॐ</Text>
      <Text style={styles.gateGreeting}>जय जिनेन्द्र</Text>
      <Text style={styles.gateTitle}>
        Select Language{'\n'}भाषा चुनें · ભાષા પસંદ કરો
      </Text>
      <View style={styles.gateList}>
        {LANGUAGES.map((l) => (
          <TouchableOpacity
            key={l.code}
            activeOpacity={0.85}
            style={styles.gateItem}
            onPress={() => onPick(l.code)}
          >
            <Text style={styles.gateItemText}>{l.native}</Text>
            <Text style={styles.gateItemArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.gateHint}>You can change this later in Settings</Text>
    </LinearGradient>
  );
}

// -------------------- Settings Modal --------------------
function SettingsModal({ visible, onClose, language, theme, onLanguage, onTheme, colors, styles, t }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>{t('settings')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.settingLabel}>{t('language')}</Text>
          <View style={styles.segment}>
            {LANGUAGES.map((l) => {
              const on = l.code === language;
              return (
                <TouchableOpacity
                  key={l.code}
                  onPress={() => onLanguage(l.code)}
                  style={[styles.segmentBtn, on && styles.segmentBtnOn]}
                >
                  <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{l.native}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.settingLabel}>{t('theme')}</Text>
          <View style={styles.segment}>
            {[
              { key: 'dark', label: `☾ ${t('dark')}` },
              { key: 'light', label: `☀ ${t('light')}` },
            ].map((opt) => {
              const on = opt.key === theme;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => onTheme(opt.key)}
                  style={[styles.segmentBtn, on && styles.segmentBtnOn]}
                >
                  <Text style={[styles.segmentText, on && styles.segmentTextOn]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>{t('done')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// -------------------- Tirth Picker Modal --------------------
function TirthPicker({ visible, onClose, onSelect, selectedId, location, language, colors, styles, t }) {
  const [query, setQuery] = useState('');
  const [sortNearest, setSortNearest] = useState(false);

  const data = useMemo(() => {
    let list = TIRTHS.map((tt) => ({
      ...tt,
      _name: tt.name[language] || tt.name.en,
      _region: REGIONS[tt.region][language] || REGIONS[tt.region].en,
      distance: location
        ? calculateDistance(location.latitude, location.longitude, tt.latitude, tt.longitude)
        : null,
    }));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (tt) =>
          tt._name.toLowerCase().includes(q) ||
          tt._region.toLowerCase().includes(q) ||
          tt.name.en.toLowerCase().includes(q)
      );
    }
    if (sortNearest && location) {
      list = [...list].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
    }
    return list;
  }, [query, sortNearest, location, language]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitle}>{t('chooseTirth')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.search}
            placeholder={t('search')}
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />

          <View style={styles.chipRow}>
            <TouchableOpacity
              onPress={() => setSortNearest((s) => !s)}
              style={[styles.chip, sortNearest && styles.chipOn]}
              disabled={!location}
            >
              <Text style={[styles.chipText, sortNearest && styles.chipTextOn]}>
                ↕ {t('nearest')}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            style={{ flexGrow: 0 }}
            renderItem={({ item }) => {
              const active = item.id === selectedId;
              return (
                <Pressable
                  onPress={() => onSelect(item)}
                  style={({ pressed }) => [
                    styles.row,
                    active && styles.rowActive,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowName, active && { color: colors.goldBright }]}>
                      {item._name}
                    </Text>
                    <Text style={styles.rowMeta}>{item._region}</Text>
                  </View>
                  <Text style={styles.rowDist}>
                    {item.distance != null ? fmtDistance(item.distance) : ''}
                  </Text>
                  {active && <Text style={styles.rowCheck}>✓</Text>}
                </Pressable>
              );
            }}
            ListEmptyComponent={<Text style={styles.emptyText}>{t('noMatch')}</Text>}
          />
        </View>
      </View>
    </Modal>
  );
}

// -------------------- SVG Compass Dial --------------------
function CompassDial({ size, bearing, aligned, colors }) {
  const r = size / 2;
  const ticks = [];
  for (let i = 0; i < 72; i++) {
    const angle = i * 5;
    const isMajor = angle % 90 === 0;
    const isMid = angle % 30 === 0;
    const len = isMajor ? 20 : isMid ? 13 : 6;
    const rad = toRad(angle);
    const x1 = r + (r - 14) * Math.sin(rad);
    const y1 = r - (r - 14) * Math.cos(rad);
    const x2 = r + (r - 14 - len) * Math.sin(rad);
    const y2 = r - (r - 14 - len) * Math.cos(rad);
    ticks.push(
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isMajor ? colors.tickMajor : isMid ? colors.tickMid : colors.tickMinor}
        strokeWidth={isMajor ? 2.5 : isMid ? 1.6 : 1}
      />
    );
  }

  const degLabels = [];
  for (let a = 0; a < 360; a += 30) {
    if (a % 90 === 0) continue;
    const rad = toRad(a);
    const x = r + (r - 46) * Math.sin(rad);
    const y = r - (r - 46) * Math.cos(rad);
    degLabels.push(
      <SvgText
        key={`deg-${a}`}
        x={x}
        y={y + 4}
        fontSize={11}
        fill={colors.degLabel}
        textAnchor="middle"
        transform={`rotate(${a}, ${x}, ${y})`}
      >
        {a}
      </SvgText>
    );
  }

  const cardinals = [
    { label: 'N', angle: 0, color: colors.cardinalN },
    { label: 'E', angle: 90, color: colors.gold },
    { label: 'S', angle: 180, color: colors.gold },
    { label: 'W', angle: 270, color: colors.gold },
  ];

  const pipRad = toRad(bearing);
  const pipX = r + (r - 30) * Math.sin(pipRad);
  const pipY = r - (r - 30) * Math.cos(pipRad);

  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id="dialBg" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={colors.dialStops[0]} />
          <Stop offset="78%" stopColor={colors.dialStops[1]} />
          <Stop offset="100%" stopColor={colors.dialStops[2]} />
        </RadialGradient>
      </Defs>

      <Circle cx={r} cy={r} r={r - 2} fill="url(#dialBg)" stroke={colors.ringStroke} strokeWidth={3} />
      <Circle cx={r} cy={r} r={r - 10} fill="none" stroke={colors.innerStroke} strokeWidth={1} />
      <Circle cx={r} cy={r} r={r - 62} fill="none" stroke={colors.centerRingStroke} strokeWidth={1} />

      <G opacity={0.3}>
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 360) / 24;
          const rad = toRad(a);
          const x = r + (r - 74) * Math.sin(rad);
          const y = r - (r - 74) * Math.cos(rad);
          return <Circle key={`petal-${i}`} cx={x} cy={y} r={2.5} fill={colors.petal} />;
        })}
      </G>

      {ticks}
      {degLabels}

      {cardinals.map(({ label, angle, color }) => {
        const rad = toRad(angle);
        const x = r + (r - 40) * Math.sin(rad);
        const y = r - (r - 40) * Math.cos(rad);
        return (
          <SvgText
            key={label}
            x={x}
            y={y + 8}
            fontSize={label === 'N' ? 24 : 18}
            fontWeight="bold"
            fill={color}
            textAnchor="middle"
            transform={`rotate(${angle}, ${x}, ${y})`}
          >
            {label}
          </SvgText>
        );
      })}

      <Circle cx={pipX} cy={pipY} r={9} fill={aligned ? colors.align : colors.goldBright} opacity={0.28} />
      <Circle
        cx={pipX}
        cy={pipY}
        r={5}
        fill={aligned ? colors.align : colors.goldBright}
        stroke={colors.dialStops[1]}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

function Needle({ size, aligned, colors }) {
  const r = size / 2;
  const tipLen = r - 40;
  const tailLen = r * 0.34;
  const tip = aligned ? colors.align : colors.needleTip;
  const tip2 = aligned ? '#3fae74' : colors.needleTip2;
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Defs>
        <SvgLinearGradient id="needleGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={tip} />
          <Stop offset="100%" stopColor={tip2} />
        </SvgLinearGradient>
      </Defs>
      <Path
        d={`M ${r} ${r - tipLen}
            L ${r - 10} ${r - tipLen + 30}
            L ${r} ${r - 8}
            L ${r + 10} ${r - tipLen + 30}
            Z`}
        fill="url(#needleGrad)"
        stroke={colors.needleTail}
        strokeWidth={1}
      />
      <Path
        d={`M ${r} ${r + tailLen}
            L ${r - 6} ${r + 8}
            L ${r} ${r + 16}
            L ${r + 6} ${r + 8}
            Z`}
        fill={colors.needleTail}
      />
    </Svg>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: Platform.OS === 'ios' ? 60 : 38,
      paddingBottom: 24,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '90%',
      gap: 6,
      marginBottom: 2,
    },
    topBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.chipBg,
      borderWidth: 1,
      borderColor: c.chipBorder,
    },
    topBtnIcon: { color: c.gold, fontSize: 18 },

    header: { alignItems: 'center', marginBottom: 12, width: '90%' },
    eyebrow: { color: c.gold, letterSpacing: 3, fontSize: 11, marginBottom: 8 },
    tirthButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.cardBg,
      borderWidth: 1,
      borderColor: c.cardBorder,
      borderRadius: 30,
      paddingVertical: 8,
      paddingHorizontal: 18,
      maxWidth: '100%',
    },
    tirthName: { color: c.text, fontSize: 21, fontWeight: '600', letterSpacing: 0.5 },
    tirthChevron: { color: c.gold, fontSize: 18, marginLeft: 8, marginTop: -4 },
    coords: { color: c.textMuted, fontSize: 12, marginTop: 8 },

    dialWrap: { alignItems: 'center', justifyContent: 'center', marginVertical: 6 },
    glowRing: { position: 'absolute', borderWidth: 1 },
    topNotch: {
      position: 'absolute',
      top: -8,
      width: 0,
      height: 0,
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderTopWidth: 14,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: c.goldBright,
    },
    needleWrap: { position: 'absolute' },
    centerHub: {
      position: 'absolute',
      width: 92,
      height: 92,
      borderRadius: 46,
      backgroundColor: c.hubBg,
      borderWidth: 2,
      borderColor: c.gold,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headingDeg: { color: c.goldBright, fontSize: 30, fontWeight: '700', lineHeight: 34 },
    headingCard: { color: c.textMuted, fontSize: 13, letterSpacing: 1, marginTop: 2 },

    statusPill: {
      marginTop: 16,
      paddingVertical: 9,
      paddingHorizontal: 20,
      borderRadius: 22,
      backgroundColor: c.pillBg,
      borderWidth: 1,
      borderColor: c.pillBorder,
    },
    statusPillOn: { backgroundColor: c.pillOnBg, borderColor: c.pillOnBorder },
    statusText: { color: c.text, fontSize: 15, fontWeight: '600' },

    infoCard: {
      marginTop: 16,
      width: '86%',
      backgroundColor: c.cardBg,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.cardBorder,
      paddingVertical: 6,
      paddingHorizontal: 20,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    divider: { height: 1, backgroundColor: c.divider },
    infoLabel: { color: c.textMuted, fontSize: 14 },
    infoValue: { color: c.text, fontSize: 16, fontWeight: '600' },
    errorText: { color: '#e08a8a', textAlign: 'center', paddingVertical: 14 },
    footerNote: { color: c.footer, fontSize: 11, marginTop: 14, textAlign: 'center', width: '80%' },

    // Language gate
    gateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
    gateOm: { color: c.goldBright, fontSize: 64, marginBottom: 6 },
    gateGreeting: { color: c.gold, fontSize: 18, letterSpacing: 2, marginBottom: 30 },
    gateTitle: { color: c.text, fontSize: 18, textAlign: 'center', lineHeight: 26, marginBottom: 28 },
    gateList: { width: '100%', maxWidth: 340 },
    gateItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: c.cardBg,
      borderWidth: 1,
      borderColor: c.cardBorder,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 22,
      marginBottom: 14,
    },
    gateItemText: { color: c.text, fontSize: 22, fontWeight: '600' },
    gateItemArrow: { color: c.gold, fontSize: 20 },
    gateHint: { color: c.textMuted, fontSize: 12, marginTop: 18, textAlign: 'center' },

    // Modals
    modalBackdrop: { flex: 1, backgroundColor: c.overlay, justifyContent: 'flex-end' },
    modalSheet: {
      backgroundColor: c.sheetBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: c.cardBorder,
      paddingHorizontal: 18,
      paddingTop: 10,
      paddingBottom: 28,
      maxHeight: '82%',
    },
    modalHandle: {
      alignSelf: 'center',
      width: 42,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.cardBorder,
      marginBottom: 10,
    },
    modalHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    modalTitle: { color: c.text, fontSize: 20, fontWeight: '700' },
    modalClose: { color: c.gold, fontSize: 20, fontWeight: '600' },
    search: {
      backgroundColor: c.inputBg,
      borderWidth: 1,
      borderColor: c.cardBorder,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === 'ios' ? 12 : 8,
      color: c.text,
      fontSize: 15,
      marginBottom: 12,
    },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    chip: {
      paddingVertical: 6,
      paddingHorizontal: 13,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.chipBorder,
      backgroundColor: c.chipBg,
    },
    chipOn: { backgroundColor: c.gold, borderColor: c.gold },
    chipText: { color: c.textMuted, fontSize: 13, fontWeight: '600' },
    chipTextOn: { color: c.chipTextOn },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginBottom: 6,
      backgroundColor: c.rowBg,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    rowActive: { backgroundColor: c.cardBg, borderColor: c.cardBorder },
    rowName: { color: c.text, fontSize: 16, fontWeight: '600' },
    rowMeta: { color: c.textMuted, fontSize: 12, marginTop: 2 },
    rowDist: { color: c.textMuted, fontSize: 13, marginRight: 8 },
    rowCheck: { color: c.goldBright, fontSize: 16, fontWeight: '700' },
    emptyText: { color: c.textMuted, textAlign: 'center', paddingVertical: 30 },

    // Settings
    settingLabel: {
      color: c.textMuted,
      fontSize: 13,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginTop: 8,
      marginBottom: 10,
    },
    segment: {
      flexDirection: 'row',
      backgroundColor: c.chipBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.chipBorder,
      padding: 4,
      marginBottom: 18,
      gap: 4,
    },
    segmentBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentBtnOn: { backgroundColor: c.gold },
    segmentText: { color: c.textMuted, fontSize: 15, fontWeight: '600' },
    segmentTextOn: { color: c.chipTextOn },
    doneBtn: {
      marginTop: 6,
      backgroundColor: c.gold,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: 'center',
    },
    doneBtnText: { color: c.chipTextOn, fontSize: 16, fontWeight: '700' },
  });
}
