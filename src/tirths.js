// ---------------------------------------------------------------------------
// JAIN TIRTH STHAL — the compass points at whichever entry the user picks
// from the tirth dropdown (see App.js `selectedTirthId`), defaulting to the
// first entry. Coordinates are of the main temple / sanctum. `place` is the
// nearest town/city, shown under the tirth name as "<place> · <region>"
// (see shatrunjay.pdf reference header). `place`/`praiseVerse` are optional
// per tirth. See `MILESTONES_INTRO` below for the combined anniversary
// banner shown once on first launch.
// ---------------------------------------------------------------------------
export const TIRTHS = [
  {
    id: 'shatrunjaya',
    name: { en: 'Shatrunjaya Tirth', hi: 'शत्रुंजय तीर्थ', gu: 'શત્રુંજય તીર્થ' },
    place: { en: 'Palitana', hi: 'पालीताणा', gu: 'પાલીતાણા' },
    region: 'gujarat',
    latitude: 21.482778,
    longitude: 71.795,
    // Second devotional verse recited after the Navkar Mantra, specific to
    // Shatrunjaya's alternate hill-names (Siddhachal/Vimalachal) — see
    // handwritten addition in the CamScanner annotated PDF.
    praiseVerse: {
      title: { en: 'Giriraj Vandana', hi: 'गिरिराज वंदना', gu: 'ગિરિરાજ વંદના' },
      lines: {
        en: [
          'Siddhachal Giri Namo Namah',
          'Vimalachal Giri Namo Namah',
          'Shatrunjaya Giri Namo Namah',
          'Vandan Ho Girirajne',
        ],
        hi: [
          'सिद्धाचल गिरि नमो नमः',
          'विमलाचल गिरि नमो नमः',
          'शत्रुंजय गिरि नमो नमः',
          'वंदन हो गिरिराजने',
        ],
        gu: [
          'સિદ્ધાચલ ગિરિ નમો નમઃ',
          'વિમલાચલ ગિરિ નમો નમઃ',
          'શત્રુંજય ગિરિ નમો નમઃ',
          'વંદન હો ગિરિરાજને',
        ],
      },
    },
  },
  {
    id: 'girnar',
    name: { en: 'Girnar Tirth', hi: 'गिरनार तीर्थ', gu: 'ગિરનાર તીર્થ' },
    place: { en: 'Junagadh', hi: 'जूनागढ़', gu: 'જૂનાગઢ' },
    region: 'gujarat',
    // Neminath Temple, Girnar hill.
    latitude: 21.524722,
    longitude: 70.4625,
  },
  {
    id: 'shree-abu',
    name: { en: 'Shree Abu Tirth', hi: 'श्री आबू तीर्थ', gu: 'શ્રી આબુ તીર્થ' },
    place: { en: 'Mount Abu', hi: 'माउंट आबू', gu: 'માઉન્ટ આબુ' },
    region: 'rajasthan',
    // Dilwara Jain Temples, Mount Abu.
    latitude: 24.6178,
    longitude: 72.7128,
  },
];

// Combined anniversary/milestone banner (shown once, on first app launch —
// see App.js `MILESTONES_INTRO_ID`), mentioning all three tirths' occasions
// together. Structured as bullet lists (rather than one prose string) so
// MilestoneSheet can render each line with its own icon.
export const MILESTONES_INTRO = {
  title: {
    en: 'Our Good Fortune — Witnessing Three Historic Occasions',
    hi: 'हमारा सौभाग्य, तीन ऐतिहासिक अवसरों के साक्षी बनने का',
    gu: 'આપણું સૌભાગ્ય, ત્રણ ઐતિહાસિક અવસરોના સાક્ષી બનવાનું',
  },
  // Each entry rendered as an icon + text bullet (see MilestoneSheet's
  // ANNIVERSARY_ICON).
  anniversaries: [
    {
      en: "Shri Shatrunjaya Maha Tirth's 500th anniversary (Vikram Samvat 2087, Vaishakh Vad 6)",
      hi: 'श्री शत्रुंजय महातीर्थ की ५००वीं सालगिरा (वि. सं. २०८७ वैशाख वद ६)',
      gu: 'શ્રીશત્રુંજય મહાતીર્થ ૫૦૦મી સાલગિરા (વિ. સં. ૨૦૮૭ વૈશાખ વદ ૬)',
    },
    {
      en: "Shri Girnar Maha Tirth's 900th anniversary (Vikram Samvat 2085, Vaishakh Sud 15)",
      hi: 'श्री गिरनार महातीर्थ की ९००वीं सालगिरा (वि. सं. २०८५ वैशाख सुद १५)',
      gu: 'શ્રીગિરનાર મહાતીર્થ ૯૦૦મી સાલગિરા (વિ. સં. ૨૦૮૫ વૈશાખ સુદ ૧૫)',
    },
    {
      en: "Shri Abu Maha Tirth's 100th anniversary (Vikram Samvat 2088, Jeth Sud 4)",
      hi: 'श्री आबू महातीर्थ की १००वीं सालगिरा (वि. सं. २०८८ जेठ सुद ४)',
      gu: 'શ્રીઆબૂ મહાતીર્થ ૧૦૦મી સાલગિરા (વિ. સં. ૨૦૮૮ જેઠ સુદ ૪)',
    },
  ],
  // Plain paragraph, shown between the two bullet groups.
  prayerNote: {
    en: 'For these three Maha Tirths, let us pray daily if possible — or at least every Sunday — facing the direction of each tirth for three minutes, so that the glory of the tirth spreads through the three worlds.',
    hi: 'हम इन तीनों महातीर्थों के लिए, बन सके तो रोज़, न बन सके तो हर रविवार, उस-उस तीर्थ की दिशा में तीन मिनट देकर तीर्थ का प्रभाव तीनों लोक में फैले ऐसी प्रार्थना करें।',
    gu: 'આપણે આ ત્રણ મહાતીર્થો માટે બની શકે તો રોજ, ન બની શકે તો હર રવિવારે તે-તે તીર્થની દિશામાં ત્રણ મિનિટ આપીને તીર્થનો પ્રભાવ ત્રણ લોકમાં કેલાય તેવી પ્રાર્થના કરીએ.',
  },
  // Each entry rendered as an icon + text bullet (see MilestoneSheet's
  // INSTRUCTION_ICONS, matched by index).
  instructions: [
    {
      en: 'You can set the reminder however you like.',
      hi: 'आप अपनी इच्छानुसार रिमाइंडर सेट कर सकते हैं।',
      gu: 'આપ જે પ્રમાણે ઈચ્છો તે પ્રમાણે રિમાઇન્ડર ગોઠવી શકો છો.',
    },
    {
      en: 'At what time each day',
      hi: 'रोज़ किस समय',
      gu: 'દરરોજ કયા સમયે',
    },
    {
      en: 'At what time every Sunday (an alarm will sound at the time you set)',
      hi: 'हर रविवार किस समय (आपके तय किए समय पर अलार्म बजेगा)',
      gu: 'હર રવિવારે કયા સમયે (આપે ગોઠવેલ સમયે એલાર્મ વાગશે)',
    },
    {
      en: "After that, whichever tirth you tap on, you will see that tirth's direction.",
      hi: 'इसके बाद आप जिस तीर्थ पर क्लिक करेंगे, क्रमशः उस तीर्थ की दिशा आपको दिखाई देगी।',
      gu: 'ત્યાર બાદ ક્રમશઃ આપ જે તીર્થ પર ક્લિક કરશો તે તીર્થની દિશા આપને દેખાશે.',
    },
    {
      en: 'Facing that direction, you will be able to offer your prayer.',
      hi: 'उस दिशा की ओर मुख करके आप अपनी प्रार्थना कर सकेंगे।',
      gu: 'તે દિશા સન્મુખ રહી આપની પ્રાર્થના આપ કરી શકશો.',
    },
  ],
};
