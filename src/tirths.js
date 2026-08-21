// ---------------------------------------------------------------------------
// JAIN TIRTH STHAL — the compass points at whichever entry the user picks
// from the tirth dropdown (see App.js `selectedTirthId`), defaulting to the
// first entry. Coordinates are of the main temple / sanctum. `place` is the
// nearest town/city, shown under the tirth name as "<place> · <region>"
// (see shatrunjay.pdf reference header). `place`/`milestone`/`praiseVerse`
// are all optional per tirth.
// ---------------------------------------------------------------------------
export const TIRTHS = [
  {
    id: 'shatrunjaya',
    name: { en: 'Shatrunjaya Tirth', hi: 'शत्रुंजय तीर्थ', gu: 'શત્રુંજય તીર્થ' },
    place: { en: 'Palitana', hi: 'पालीताणा', gu: 'પાલીતાણા' },
    region: 'gujarat',
    latitude: 21.482778,
    longitude: 71.795,
    // Anniversary / milestone banner shown once when this tirth is opened —
    // see shatrunjay.pdf reference (500-year Mahotsav reminder prompt).
    milestone: {
      id: 'shatrunjaya-500',
      title: {
        en: '500th Anniversary Occasion',
        hi: '५००वीं सालगिरा का अवसर',
        gu: '૫૦૦મી સાલગિરાનો અવસર',
      },
      message: {
        en: 'On the occasion of the upcoming 500th anniversary of the consecration (Pratishtha) of Dada Adinath at Shatrunjaya Maha Tirth, let us pray facing the tirth with the wish that its glory spreads throughout the world. Would you like to set a reminder?',
        hi: 'शत्रुंजय महातीर्थ पर दादा आदिनाथ की प्रतिष्ठा की आ रही ५००वीं वर्षगांठ के उपलक्ष्य में, तीर्थ का प्रभाव समस्त विश्व में व्याप्त हो ऐसे भाव से तीर्थ के सन्मुख प्रार्थना करें। क्या आप रिमाइंडर सेट करना चाहते हैं?',
        gu: 'શત્રુંજય મહાતીર્થ પર દાદા આદિનાથની પ્રતિષ્ઠાની આવી રહેલી ૫૦૦મી વર્ષગાંઠના ઉપલક્ષ્યમાં તીર્થનો પ્રભાવ સમસ્ત વિશ્વમાં વ્યાપે એવા ભાવથી તીર્થ સન્મુખ પ્રાર્થના કરીએ. શું તમે રિમાઇન્ડર સેટ કરવા માંગો છો?',
      },
    },
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
