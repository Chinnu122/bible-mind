/**
 * Search Service - ElasticSearch Integration
 * 
 * Provides multilingual full-text search with:
 * - Language-specific analyzers (Hebrew, Greek, English, Telugu, Hindi)
 * - Edge n-gram and fuzzy matching for partial queries
 * - Strong's number ↔ word mapping
 * - Ranked results with explanation
 */

import { Client } from '@elastic/elasticsearch';

// ElasticSearch Client Singleton
const esClient = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: process.env.ELASTICSEARCH_API_KEY
        ? { apiKey: process.env.ELASTICSEARCH_API_KEY }
        : undefined,
});

// ============================================
// INDEX NAMES
// ============================================
const INDICES = {
    VERSES: 'bible_verses',
    LEXICON: 'bible_lexicon',
    STRONGS_MAPPING: 'strongs_mapping',
};

// ============================================
// INDEX MAPPINGS & SETTINGS
// ============================================

const verseIndexSettings = {
    settings: {
        number_of_shards: 1,
        number_of_replicas: 0,
        analysis: {
            analyzer: {
                // Hebrew analyzer (with nikkud/vowel handling)
                hebrew_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'hebrew_normalization'],
                },
                // Greek analyzer
                greek_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'greek_normalization'],
                },
                // English analyzer with stemming
                english_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'english_stop', 'english_stemmer'],
                },
                // Edge n-gram for autocomplete
                autocomplete: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'edge_ngram_filter'],
                },
                // Transliteration-friendly (ASCII folding)
                transliteration_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'asciifolding'],
                },
            },
            filter: {
                hebrew_normalization: {
                    type: 'icu_normalizer',
                    name: 'nfkc',
                },
                greek_normalization: {
                    type: 'icu_normalizer',
                    name: 'nfkc',
                },
                english_stop: {
                    type: 'stop',
                    stopwords: '_english_',
                },
                english_stemmer: {
                    type: 'stemmer',
                    language: 'english',
                },
                edge_ngram_filter: {
                    type: 'edge_ngram',
                    min_gram: 2,
                    max_gram: 15,
                },
            },
        },
    },
    mappings: {
        properties: {
            bookId: { type: 'integer' },
            bookName: { type: 'keyword' },
            chapter: { type: 'integer' },
            verse: { type: 'integer' },
            reference: { type: 'keyword' }, // e.g., "Genesis 1:1"

            // Hebrew text with Hebrew analyzer
            hebrewText: {
                type: 'text',
                analyzer: 'hebrew_analyzer',
                fields: {
                    autocomplete: { type: 'text', analyzer: 'autocomplete' },
                },
            },

            // Greek text with Greek analyzer
            greekText: {
                type: 'text',
                analyzer: 'greek_analyzer',
                fields: {
                    autocomplete: { type: 'text', analyzer: 'autocomplete' },
                },
            },

            // Transliteration (searchable with ASCII folding)
            transliteration: {
                type: 'text',
                analyzer: 'transliteration_analyzer',
                fields: {
                    autocomplete: { type: 'text', analyzer: 'autocomplete' },
                },
            },

            // English translations
            kjvText: {
                type: 'text',
                analyzer: 'english_analyzer',
                fields: {
                    autocomplete: { type: 'text', analyzer: 'autocomplete' },
                },
            },
            webText: {
                type: 'text',
                analyzer: 'english_analyzer',
            },
            jpsText: {
                type: 'text',
                analyzer: 'english_analyzer',
            },
            brentonText: {
                type: 'text',
                analyzer: 'english_analyzer',
            },

            // Telugu/Hindi (standard analyzer works for Devanagari/Telugu scripts)
            teluguText: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                    autocomplete: { type: 'text', analyzer: 'autocomplete' },
                },
            },
            hindiText: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                    autocomplete: { type: 'text', analyzer: 'autocomplete' },
                },
            },

            // Strong's numbers for word-level search
            strongNumbers: { type: 'keyword' },

            // Testament filter
            testament: { type: 'keyword' },
        },
    },
};

const lexiconIndexSettings = {
    settings: {
        number_of_shards: 1,
        analysis: {
            analyzer: {
                lemma_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase'],
                },
            },
        },
    },
    mappings: {
        properties: {
            strongNumber: { type: 'keyword' },
            lemma: {
                type: 'text',
                analyzer: 'lemma_analyzer',
                fields: {
                    keyword: { type: 'keyword' },
                },
            },
            language: { type: 'keyword' },
            gloss: { type: 'text', analyzer: 'english_analyzer' },
            definition: { type: 'text', analyzer: 'english_analyzer' },
            partOfSpeech: { type: 'keyword' },
            teluguMeaning: { type: 'text', analyzer: 'standard' },
            hindiMeaning: { type: 'text', analyzer: 'standard' },
            occurrences: { type: 'integer' },
            rootWord: { type: 'text' },
        },
    },
};

// ============================================
// INDEX MANAGEMENT
// ============================================

export async function createIndices(): Promise<void> {
    try {
        // Create verses index
        const versesExists = await esClient.indices.exists({ index: INDICES.VERSES });
        if (!versesExists) {
            await esClient.indices.create({
                index: INDICES.VERSES,
                settings: verseIndexSettings.settings as any,
                mappings: verseIndexSettings.mappings as any,
            });
            console.log(`✅ Created index: ${INDICES.VERSES}`);
        }

        // Create lexicon index
        const lexiconExists = await esClient.indices.exists({ index: INDICES.LEXICON });
        if (!lexiconExists) {
            await esClient.indices.create({
                index: INDICES.LEXICON,
                settings: lexiconIndexSettings.settings as any,
                mappings: lexiconIndexSettings.mappings as any,
            });
            console.log(`✅ Created index: ${INDICES.LEXICON}`);
        }
    } catch (error) {
        console.error('Failed to create indices:', error);
        throw error;
    }
}

// ============================================
// SEARCH FUNCTIONS
// ============================================

export interface SearchOptions {
    query: string;
    language?: 'hebrew' | 'greek' | 'english' | 'telugu' | 'hindi' | 'auto';
    filters?: {
        testament?: 'old' | 'new';
        bookId?: number;
        strongNumber?: string;
    };
    limit?: number;
    explain?: boolean;
}

export interface SearchResult {
    id: string;
    score: number;
    bookId: number;
    bookName: string;
    chapter: number;
    verse: number;
    reference: string;
    matchedField: string;
    highlightedText: string;
    explanation?: string;
}

/**
 * Multilingual Bible Search
 * 
 * Ranking Priority:
 * 1. Exact Hebrew lemma match
 * 2. Exact transliteration match
 * 3. Exact English/Telugu/Hindi match
 * 4. Fuzzy matches
 */
export async function searchVerses(options: SearchOptions): Promise<SearchResult[]> {
    const { query, language = 'auto', filters, limit = 50, explain = false } = options;

    // Detect language if auto
    const detectedLang = language === 'auto' ? detectLanguage(query) : language;

    // Build query based on detected language
    const shouldClauses: any[] = [];

    // Primary language-specific search
    switch (detectedLang) {
        case 'hebrew':
            shouldClauses.push(
                { match: { hebrewText: { query, boost: 10 } } },
                { match: { 'hebrewText.autocomplete': { query, boost: 5 } } }
            );
            break;
        case 'greek':
            shouldClauses.push(
                { match: { greekText: { query, boost: 10 } } },
                { match: { 'greekText.autocomplete': { query, boost: 5 } } }
            );
            break;
        case 'telugu':
            shouldClauses.push(
                { match: { teluguText: { query, boost: 10 } } }
            );
            break;
        case 'hindi':
            shouldClauses.push(
                { match: { hindiText: { query, boost: 10 } } }
            );
            break;
        default: // English or mixed
            shouldClauses.push(
                { match: { kjvText: { query, boost: 8 } } },
                { match: { webText: { query, boost: 6 } } },
                { match: { transliteration: { query, boost: 7 } } }
            );
    }

    // Add fuzzy fallback for all languages
    shouldClauses.push(
        { fuzzy: { kjvText: { value: query, fuzziness: 'AUTO', boost: 2 } } },
        { fuzzy: { transliteration: { value: query, fuzziness: 'AUTO', boost: 3 } } }
    );

    // Strong's number exact match (highest priority if query looks like Strong's)
    if (/^[HGA]?\d+$/i.test(query)) {
        const normalizedStrong = normalizeStrongsNumber(query);
        shouldClauses.unshift(
            { term: { strongNumbers: { value: normalizedStrong, boost: 20 } } }
        );
    }

    // Build filter clauses
    const filterClauses: any[] = [];
    if (filters?.testament) {
        filterClauses.push({ term: { testament: filters.testament } });
    }
    if (filters?.bookId) {
        filterClauses.push({ term: { bookId: filters.bookId } });
    }
    if (filters?.strongNumber) {
        filterClauses.push({ term: { strongNumbers: normalizeStrongsNumber(filters.strongNumber) } });
    }

    // Execute search
    const response = await esClient.search({
        index: INDICES.VERSES,
        size: limit,
        explain,
        query: {
            bool: {
                should: shouldClauses,
                minimum_should_match: 1,
                filter: filterClauses,
            },
        },
        highlight: {
            fields: {
                hebrewText: {},
                greekText: {},
                kjvText: {},
                webText: {},
                transliteration: {},
                teluguText: {},
                hindiText: {},
            },
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
        },
    });

    // Transform results
    return response.hits.hits.map((hit: any) => {
        const source = hit._source;
        const highlights = hit.highlight || {};
        const matchedField = Object.keys(highlights)[0] || 'unknown';

        return {
            id: hit._id,
            score: hit._score,
            bookId: source.bookId,
            bookName: source.bookName,
            chapter: source.chapter,
            verse: source.verse,
            reference: source.reference,
            matchedField,
            highlightedText: highlights[matchedField]?.[0] || source.kjvText || source.hebrewText,
            explanation: explain ? JSON.stringify(hit._explanation) : undefined,
        };
    });
}

/**
 * Search Lexicon (Strong's Dictionary)
 */
export async function searchLexicon(query: string, limit: number = 50): Promise<any[]> {
    const shouldClauses = [
        { match: { lemma: { query, boost: 10 } } },
        { term: { strongNumber: { value: normalizeStrongsNumber(query), boost: 20 } } },
        { match: { gloss: { query, boost: 5 } } },
        { match: { definition: { query, boost: 3 } } },
        { match: { teluguMeaning: { query, boost: 4 } } },
        { match: { hindiMeaning: { query, boost: 4 } } },
        { fuzzy: { lemma: { value: query, fuzziness: 'AUTO', boost: 2 } } },
    ];

    const response = await esClient.search({
        index: INDICES.LEXICON,
        size: limit,
        query: {
            bool: {
                should: shouldClauses,
                minimum_should_match: 1,
            },
        },
    });

    return response.hits.hits.map((hit: any) => ({
        ...hit._source,
        score: hit._score,
    }));
}

// ============================================
// INDEXING FUNCTIONS
// ============================================

export async function indexVerse(verse: any): Promise<void> {
    await esClient.index({
        index: INDICES.VERSES,
        id: `${verse.bookId}-${verse.chapter}-${verse.verse}`,
        document: {
            bookId: verse.bookId,
            bookName: verse.bookName,
            chapter: verse.chapter,
            verse: verse.verse,
            reference: `${verse.bookName} ${verse.chapter}:${verse.verse}`,
            hebrewText: verse.hebrewText,
            greekText: verse.greekText,
            transliteration: verse.transliteration,
            kjvText: verse.translations?.kjv || verse.kjvText,
            webText: verse.translations?.web || verse.webText,
            jpsText: verse.translations?.jps,
            brentonText: verse.translations?.brenton,
            teluguText: verse.translations?.telugu,
            hindiText: verse.translations?.hindi,
            strongNumbers: verse.strongNumbers || [],
            testament: verse.bookId <= 39 ? 'old' : 'new',
        },
    });
}

export async function indexLexiconEntry(entry: any): Promise<void> {
    await esClient.index({
        index: INDICES.LEXICON,
        id: entry.strongNumber,
        document: {
            strongNumber: entry.strongNumber,
            lemma: entry.lemma,
            language: entry.language,
            gloss: entry.gloss,
            definition: entry.definition,
            partOfSpeech: entry.partOfSpeech,
            teluguMeaning: entry.teluguMeaning,
            hindiMeaning: entry.hindiMeaning,
            occurrences: entry.occurrences,
            rootWord: entry.rootWord,
        },
    });
}

export async function bulkIndexVerses(verses: any[]): Promise<void> {
    const operations = verses.flatMap((verse) => [
        { index: { _index: INDICES.VERSES, _id: `${verse.bookId}-${verse.chapter}-${verse.verse}` } },
        {
            bookId: verse.bookId,
            bookName: verse.bookName,
            chapter: verse.chapter,
            verse: verse.verse,
            reference: `${verse.bookName} ${verse.chapter}:${verse.verse}`,
            hebrewText: verse.hebrewText,
            greekText: verse.greekText,
            kjvText: verse.translations?.kjv || verse.kjvText,
            webText: verse.translations?.web || verse.webText,
            strongNumbers: verse.strongNumbers || [],
            testament: verse.bookId <= 39 ? 'old' : 'new',
        },
    ]);

    const result = await esClient.bulk({ refresh: true, operations });
    if (result.errors) {
        console.error('Bulk indexing had errors:', result.items.filter((i: any) => i.index?.error));
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function detectLanguage(text: string): 'hebrew' | 'greek' | 'english' | 'telugu' | 'hindi' {
    // Hebrew Unicode range
    if (/[\u0590-\u05FF]/.test(text)) return 'hebrew';
    // Greek Unicode range
    if (/[\u0370-\u03FF]/.test(text)) return 'greek';
    // Telugu Unicode range
    if (/[\u0C00-\u0C7F]/.test(text)) return 'telugu';
    // Hindi/Devanagari Unicode range
    if (/[\u0900-\u097F]/.test(text)) return 'hindi';
    // Default to English
    return 'english';
}

function normalizeStrongsNumber(input: string): string {
    const trimmed = (input || '').trim().toUpperCase();
    if (!trimmed) return trimmed;

    const first = trimmed[0];
    const hasPrefix = first === 'H' || first === 'G' || first === 'A';
    const prefix = hasPrefix ? first : 'H';
    const rawDigits = (hasPrefix ? trimmed.slice(1) : trimmed).replace(/\D/g, '');

    if (!rawDigits) return trimmed;

    if (prefix === 'G') {
        return `G${parseInt(rawDigits, 10)}`;
    }
    return `${prefix}${rawDigits.padStart(4, '0')}`;
}

// ============================================
// HEALTH CHECK
// ============================================

export async function checkElasticSearchHealth(): Promise<boolean> {
    try {
        const health = await esClient.cluster.health();
        return health.status === 'green' || health.status === 'yellow';
    } catch (error) {
        console.error('ElasticSearch health check failed:', error);
        return false;
    }
}

export { esClient };
