export interface Word {
  text: string;
  original: string;
  transliteration: string;
  meaning: string;
  language: 'hebrew' | 'greek';
  strongs: string;
}

export interface Verse {
  id: string;
  reference: string;
  text: string;
  words: Word[];
}

export const mockVerses: Verse[] = [
  {
    id: 'gen-1-1',
    reference: 'Genesis 1:1',
    text: 'In the beginning God created the heaven and the earth.',
    words: [
      { text: 'In the beginning', original: 'בְּרֵאשִׁית', transliteration: 'Bereshit', meaning: 'in the beginning', language: 'hebrew', strongs: 'H7225' },
      { text: 'God', original: 'אֱלֹהִים', transliteration: 'Elohim', meaning: 'God, rulers, judges', language: 'hebrew', strongs: 'H430' },
      { text: 'created', original: 'בָּרָא', transliteration: 'bara', meaning: 'to create, shape, form', language: 'hebrew', strongs: 'H1254' },
      { text: 'the heaven', original: 'הַשָּׁמַיִם', transliteration: 'hashamayim', meaning: 'heavens, sky', language: 'hebrew', strongs: 'H8064' },
      { text: 'and', original: 'וְ', transliteration: 've', meaning: 'and', language: 'hebrew', strongs: 'H853' },
      { text: 'the earth', original: 'הָאָרֶץ', transliteration: 'haaretz', meaning: 'land, earth', language: 'hebrew', strongs: 'H776' },
    ]
  },
  {
    id: 'john-1-1',
    reference: 'John 1:1',
    text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    words: [
      { text: 'In the beginning', original: 'Ἐν ἀρχῇ', transliteration: 'En arche', meaning: 'in the beginning, origin', language: 'greek', strongs: 'G746' },
      { text: 'was', original: 'ἦν', transliteration: 'en', meaning: 'was, existed', language: 'greek', strongs: 'G2258' },
      { text: 'the Word', original: 'ὁ Λόγος', transliteration: 'ho Logos', meaning: 'word, speech, reason', language: 'greek', strongs: 'G3056' },
      { text: 'and', original: 'καὶ', transliteration: 'kai', meaning: 'and, also', language: 'greek', strongs: 'G2532' },
      { text: 'with', original: 'πρὸς', transliteration: 'pros', meaning: 'with, towards', language: 'greek', strongs: 'G4314' },
      { text: 'God', original: 'τὸν Θεόν', transliteration: 'ton Theon', meaning: 'God, deity', language: 'greek', strongs: 'G2316' },
    ]
  }
];
