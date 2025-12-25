import { Router, Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

const router = Router();

/**
 * GET /api/strongs/search?q=query
 * Search Strong's definitions by word, meaning, or root
 * NOTE: This route MUST be defined before /:number to avoid conflicts
 */
router.get('/search', (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query || query.length < 2) {
    res.status(400).json({
      success: false,
      error: 'Search query must be at least 2 characters',
      code: 400
    });
    return;
  }

  const results = dataStore.searchStrongs(query);

  res.json({
    success: true,
    data: results,
    meta: { total: results.length, query }
  });
});

/**
 * POST /api/strongs/bulk
 * Get multiple Strong's definitions at once
 * Body: { numbers: ["H430", "H1254", ...] }
 */
router.post('/bulk', (req: Request, res: Response) => {
  const { numbers } = req.body;

  if (!numbers || !Array.isArray(numbers)) {
    res.status(400).json({
      success: false,
      error: 'Request body must contain "numbers" array',
      code: 400
    });
    return;
  }

  const results: Record<string, any> = {};
  const notFound: string[] = [];

  for (const num of numbers.slice(0, 100)) { // Limit to 100
    const def = dataStore.getStrongs(num);
    if (def) {
      results[def.strongsNumber] = def;
    } else {
      notFound.push(num);
    }
  }

  res.json({
    success: true,
    data: results,
    meta: {
      found: Object.keys(results).length,
      notFound: notFound.length > 0 ? notFound : undefined
    }
  });
});

/**
 * GET /api/strongs/all
 * Get all Strong's definitions (for frontend caching)
 */
router.get('/all', (_req: Request, res: Response) => {
  const allStrongs = dataStore.getAllStrongs();

  res.json({
    success: true,
    data: allStrongs,
    meta: { total: allStrongs.length }
  });
});

/**
 * GET /api/strongs/:number
 * Get a Strong's definition by number (e.g., H430, G3056)
 */
router.get('/:number', (req: Request, res: Response) => {
  const strongsNum = req.params.number;
  const definition = dataStore.getStrongs(strongsNum);

  if (!definition) {
    res.status(404).json({
      success: false,
      error: `Strong's number ${strongsNum} not found`,
      code: 404
    });
    return;
  }

  res.json({
    success: true,
    data: definition
  });
});

/**
 * GET /api/strongs/:number/multilang
 * Get multi-language translations (Telugu, Hindi, Greek) for a Strong's number
 */
router.get('/:number/multilang', (req: Request, res: Response) => {
  const strongsNum = req.params.number.toUpperCase();

  // Multi-language data - in production, load from TeluguHindiStrongs.csv
  const multiLangData: Record<string, { telugu: string; hindi: string; greek: string }> = {
    'H7225': { telugu: 'ఆరంభము - మొదటిది', hindi: 'आरंभ - प्रथम', greek: 'ἀρχή (archē)' },
    'H0430': { telugu: 'ఎలోహీమ్ - దేవుడు', hindi: 'एलोहीम - परमेश्वर', greek: 'θεός (theos)' },
    'H1254': { telugu: 'బారా - సృష్టించు', hindi: 'बारा - सृजना करना', greek: 'κτίζω (ktizō)' },
    'H8064': { telugu: 'షామయిమ్ - ఆకాశము', hindi: 'शामयिम - आकाश', greek: 'οὐρανός (ouranos)' },
    'H0776': { telugu: 'ఎరెత్స్ - భూమి', hindi: 'एरेट्स - पृथ्वी', greek: 'γῆ (gē)' },
    'H3068': { telugu: 'యహ్వే - ప్రభువు', hindi: 'यहवे - यहोवा', greek: 'κύριος (kyrios)' },
    'H0157': { telugu: 'ఆహబ్ - ప్రేమించు', hindi: 'आहब् - प्रेम करना', greek: 'ἀγαπάω (agapaō)' },
    'H7965': { telugu: 'షాలోమ్ - శాంతి', hindi: 'शालोम - शांति', greek: 'εἰρήνη (eirēnē)' },
    'H0001': { telugu: 'అబ్ - తండ్రి', hindi: 'अब् - पिता', greek: 'πατήρ (patēr)' },
    'H0113': { telugu: 'ఆదోన్ - ప్రభువు', hindi: 'आदोन - स्वामी', greek: 'κύριος (kyrios)' },
    'H0119': { telugu: 'ఆదమ్ - ఎర్రగా చేయు', hindi: 'आदम - लाल होना', greek: 'πυρρός (pyrros)' },
    'H0120': { telugu: 'ఆదామ్ - మానవుడు', hindi: 'आदाम - मनुष्य', greek: 'ἄνθρωπος (anthrōpos)' },
    'H0136': { telugu: 'అదోనాయ్ - ప్రభువు', hindi: 'अदोनाय - प्रभु', greek: 'κύριος (kyrios)' },
    'H4325': { telugu: 'మయిమ్ - నీళ్ళు', hindi: 'मयिम - पानी', greek: 'ὕδωρ (hydōr)' },
    'H5315': { telugu: 'నెఫెష్ - ప్రాణము', hindi: 'नेफेश - प्राण', greek: 'ψυχή (psychē)' },
    'H7307': { telugu: 'రూాచ్ - ఆత్మ', hindi: 'रूआख - आत्मा', greek: 'πνεῦμα (pneuma)' },
  };

  const translations = multiLangData[strongsNum];

  res.json({
    success: true,
    data: translations || null,
    meta: { strongsNumber: strongsNum }
  });
});

/**
 * GET /api/strongs/:number/occurrences
 * Get all occurrence locations for a Strong's number
 */
router.get('/:number/occurrences', (req: Request, res: Response) => {
  const strongsNum = req.params.number.toUpperCase();

  // In production, this would query the actual concordance data
  // For now, return mock data for demonstration
  const occurrenceData: Record<string, Array<{ book: string; chapter: number; verse: number; text: string }>> = {
    'H7225': [
      { book: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.' },
      { book: 'Genesis', chapter: 10, verse: 10, text: 'And the beginning of his kingdom was Babel...' },
      { book: 'Genesis', chapter: 49, verse: 3, text: 'Reuben, thou art my firstborn, my might, and the beginning of my strength...' },
      { book: 'Exodus', chapter: 23, verse: 19, text: 'The first of the firstfruits of thy land...' },
      { book: 'Leviticus', chapter: 2, verse: 12, text: 'As for the oblation of the firstfruits...' },
      { book: 'Numbers', chapter: 15, verse: 20, text: 'Ye shall offer up a cake of the first of your dough...' },
      { book: 'Deuteronomy', chapter: 11, verse: 12, text: 'From the beginning of the year even unto the end...' },
      { book: 'Deuteronomy', chapter: 18, verse: 4, text: 'The firstfruit also of thy corn, of thy wine...' },
      { book: 'Deuteronomy', chapter: 21, verse: 17, text: 'For he is the beginning of his strength...' },
      { book: 'Deuteronomy', chapter: 26, verse: 2, text: 'Thou shalt take of the first of all the fruit...' },
      { book: 'Deuteronomy', chapter: 33, verse: 21, text: 'He provided the first part for himself...' },
      { book: '1 Samuel', chapter: 2, verse: 29, text: 'To make yourselves fat with the chiefest of all the offerings...' },
      { book: 'Nehemiah', chapter: 10, verse: 37, text: 'The firstfruits of our dough, and our offerings...' },
      { book: 'Job', chapter: 8, verse: 7, text: 'Though thy beginning was small...' },
      { book: 'Job', chapter: 40, verse: 19, text: 'He is the chief of the ways of God...' },
      { book: 'Job', chapter: 42, verse: 12, text: 'The LORD blessed the latter end of Job more than his beginning...' },
      { book: 'Psalm', chapter: 78, verse: 51, text: 'And smote all the firstborn in Egypt; the chief of their strength...' },
      { book: 'Psalm', chapter: 105, verse: 36, text: 'He smote also all the firstborn in their land, the chief of all their strength.' },
      { book: 'Psalm', chapter: 111, verse: 10, text: 'The fear of the LORD is the beginning of wisdom...' },
      { book: 'Proverbs', chapter: 1, verse: 7, text: 'The fear of the LORD is the beginning of knowledge...' },
      { book: 'Proverbs', chapter: 3, verse: 9, text: 'Honour the LORD with thy substance, and with the firstfruits...' },
      { book: 'Proverbs', chapter: 4, verse: 7, text: 'Wisdom is the principal thing; therefore get wisdom...' },
      { book: 'Proverbs', chapter: 8, verse: 22, text: 'The LORD possessed me in the beginning of his way...' },
      { book: 'Proverbs', chapter: 17, verse: 14, text: 'The beginning of strife is as when one letteth out water...' },
      { book: 'Ecclesiastes', chapter: 7, verse: 8, text: 'Better is the end of a thing than the beginning thereof...' },
      { book: 'Isaiah', chapter: 46, verse: 10, text: 'Declaring the end from the beginning...' },
      { book: 'Jeremiah', chapter: 2, verse: 3, text: 'Israel was holiness unto the LORD, and the firstfruits of his increase...' },
      { book: 'Jeremiah', chapter: 26, verse: 1, text: 'In the beginning of the reign of Jehoiakim...' },
      { book: 'Jeremiah', chapter: 27, verse: 1, text: 'In the beginning of the reign of Jehoiakim...' },
      { book: 'Jeremiah', chapter: 28, verse: 1, text: 'In the beginning of the reign of Zedekiah...' },
      { book: 'Jeremiah', chapter: 49, verse: 34, text: 'In the beginning of the reign of Zedekiah king of Judah...' },
      { book: 'Ezekiel', chapter: 20, verse: 40, text: 'There will I require your offerings, and the firstfruits...' },
      { book: 'Ezekiel', chapter: 44, verse: 30, text: 'And the first of all the firstfruits of all things...' },
      { book: 'Ezekiel', chapter: 48, verse: 14, text: 'It is the firstfruits unto the LORD...' },
      { book: 'Daniel', chapter: 11, verse: 41, text: 'These shall escape out of his hand, even Edom, and Moab, and the chief of the children of Ammon.' },
      { book: 'Hosea', chapter: 9, verse: 10, text: 'I saw your fathers as the firstripe in the fig tree at her first time...' },
      { book: 'Amos', chapter: 6, verse: 1, text: 'Woe to them that are at ease in Zion... which are named chief of the nations...' },
      { book: 'Amos', chapter: 6, verse: 6, text: 'That drink wine in bowls... they are not grieved for the affliction of Joseph.' },
      { book: 'Micah', chapter: 1, verse: 13, text: 'She is the beginning of the sin to the daughter of Zion...' },
    ],
  };

  const occurrences = occurrenceData[strongsNum] || [];

  res.json({
    success: true,
    data: occurrences,
    meta: { strongsNumber: strongsNum, total: occurrences.length }
  });
});

export default router;

