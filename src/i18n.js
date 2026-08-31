// ---------------------------------------------------------------------------
// LANGUAGES — default is Hindi. A first-launch dialog (see
// components/LanguageModal.js) prompts for a choice once, the first time the
// app opens with no language saved yet; after that it's only changed via
// Settings.
// ---------------------------------------------------------------------------
export const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिन्दी' },
  { code: 'gu', native: 'ગુજરાતી' },
];

export const DEFAULT_LANGUAGE = 'hi';

// ---------------------------------------------------------------------------
// REGION name (localised), keyed by the `region` field on each entry in
// src/tirths.js.
// ---------------------------------------------------------------------------
export const REGIONS = {
  gujarat: { en: 'Gujarat', hi: 'गुजरात', gu: 'ગુજરાત' },
  rajasthan: { en: 'Rajasthan', hi: 'राजस्थान', gu: 'રાજસ્થાન' },
};

// ---------------------------------------------------------------------------
// WEEKDAYS — `key` matches JS `Date.getDay()` (0=Sunday…6=Saturday). Used by
// the prayer-time day picker; expo-notifications' calendar trigger wants
// 1-7 (Sunday=1), so callers should pass `key + 1`.
// ---------------------------------------------------------------------------
export const DAYS = [
  { key: 0, short: { en: 'Sun', hi: 'रवि', gu: 'રવિ' } },
  { key: 1, short: { en: 'Mon', hi: 'सोम', gu: 'સોમ' } },
  { key: 2, short: { en: 'Tue', hi: 'मंगल', gu: 'મંગળ' } },
  { key: 3, short: { en: 'Wed', hi: 'बुध', gu: 'બુધ' } },
  { key: 4, short: { en: 'Thu', hi: 'गुरु', gu: 'ગુરુ' } },
  { key: 5, short: { en: 'Fri', hi: 'शुक्र', gu: 'શુક્ર' } },
  { key: 6, short: { en: 'Sat', hi: 'शनि', gu: 'શનિ' } },
];

// ---------------------------------------------------------------------------
// TRANSLATIONS
// ---------------------------------------------------------------------------
export const STRINGS = {
  en: {
    tagline: 'Sacred Direction',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    done: 'Done',
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
    // Navkar / prayer overlay
    facingTirth: 'You are facing {{name}}',
    pranam: 'Pranam',
    // Prayer time reminders
    prayerTimes: 'Prayer Times',
    addPrayerTime: '+ Add prayer time',
    on: 'ON',
    off: 'OFF',
    cancel: 'Cancel',
    saveBtn: 'Save',
    hourLabel: 'Hour',
    minuteLabel: 'Minute',
    prayerNotifTitle: 'Sacred Direction',
    prayerNotifBody: 'It’s time for prayer 🙏',
    notifPermission: 'Enable notifications in Settings to get prayer-time reminders.',
    selectDays: 'Repeat on',
    daily: 'Daily',
    // Milestone / anniversary
    yes: 'Yes',
    no: 'No',
    // Tirth picker
    chooseTirth: 'Choose tirth',
  },
  hi: {
    tagline: 'तीर्थ दिशा',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    theme: 'थीम',
    dark: 'गहरा',
    light: 'हल्का',
    done: 'हो गया',
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
    facingTirth: 'आप {{name}} की ओर हैं',
    pranam: 'प्रणाम',
    prayerTimes: 'प्रार्थना समय',
    addPrayerTime: '+ प्रार्थना समय जोड़ें',
    on: 'चालू',
    off: 'बंद',
    cancel: 'रद्द करें',
    saveBtn: 'सहेजें',
    hourLabel: 'घंटा',
    minuteLabel: 'मिनट',
    prayerNotifTitle: 'तीर्थ दिशा',
    prayerNotifBody: 'प्रार्थना का समय हो गया है 🙏',
    notifPermission: 'प्रार्थना समय की सूचना पाने हेतु सेटिंग्स में नोटिफिकेशन चालू करें।',
    selectDays: 'दोहराएँ',
    daily: 'प्रतिदिन',
    yes: 'हाँ',
    no: 'नहीं',
    chooseTirth: 'तीर्थ चुनें',
  },
  gu: {
    tagline: 'તીર્થ દિશા',
    settings: 'સેટિંગ્સ',
    language: 'ભાષા',
    theme: 'થીમ',
    dark: 'ઘેરો',
    light: 'હળવો',
    done: 'થઈ ગયું',
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
    facingTirth: 'તમે {{name}} ની દિશામાં છો',
    pranam: 'પ્રણામ',
    prayerTimes: 'પ્રાર્થના સમય',
    addPrayerTime: '+ પ્રાર્થના સમય ઉમેરો',
    on: 'ચાલુ',
    off: 'બંધ',
    cancel: 'રદ કરો',
    saveBtn: 'સાચવો',
    hourLabel: 'કલાક',
    minuteLabel: 'મિનિટ',
    prayerNotifTitle: 'તીર્થ દિશા',
    prayerNotifBody: 'પ્રાર્થનાનો સમય થયો છે 🙏',
    notifPermission: 'પ્રાર્થના સમયની સૂચના મેળવવા સેટિંગ્સમાં નોટિફિકેશન ચાલુ કરો.',
    selectDays: 'પુનરાવર્તન',
    daily: 'રોજ',
    yes: 'હા',
    no: 'ના',
    chooseTirth: 'તીર્થ પસંદ કરો',
  },
};

export function translate(language, key, vars) {
  const str = (STRINGS[language] || STRINGS.en)[key] ?? key;
  if (!vars) return str;
  return Object.keys(vars).reduce(
    (acc, k) => acc.replace(new RegExp(`{{${k}}}`, 'g'), vars[k]),
    str
  );
}
