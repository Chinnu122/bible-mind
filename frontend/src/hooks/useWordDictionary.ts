/**
 * useWordDictionary Hook
 * 
 * Provides Hebrew/Greek word meanings lookup with Telugu and English translations.
 * Loads dictionary once and caches for fast lookup.
 */

import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface WordMeaning {
    strongsNumber: string;
    originalWord: string;
    englishMeaning: string;
    teluguWord: string;
    teluguMeaning: string;
    language: string;
    testament: string;
}

interface DictionaryState {
    dictionary: WordMeaning[];
    wordMap: Map<string, WordMeaning>;
    loaded: boolean;
    loading: boolean;
    error: string | null;
}

// Global cache to avoid reloading on component remount
let globalDictionary: WordMeaning[] = [];
let globalWordMap: Map<string, WordMeaning> = new Map();
let globalLoaded = false;

export function useWordDictionary() {
    const [state, setState] = useState<DictionaryState>({
        dictionary: globalDictionary,
        wordMap: globalWordMap,
        loaded: globalLoaded,
        loading: false,
        error: null
    });

    // Load dictionary on first use
    useEffect(() => {
        if (globalLoaded) {
            setState(prev => ({
                ...prev,
                dictionary: globalDictionary,
                wordMap: globalWordMap,
                loaded: true
            }));
            return;
        }

        const loadDictionary = async () => {
            setState(prev => ({ ...prev, loading: true, error: null }));

            try {
                const response = await fetch(`${API_BASE_URL}/dictionary/all`);
                const json = await response.json();

                if (json.success && json.data) {
                    const dictionary: WordMeaning[] = json.data;
                    const wordMap = new Map<string, WordMeaning>();

                    // Build lookup map
                    dictionary.forEach(entry => {
                        if (entry.originalWord) {
                            // Store by original word
                            wordMap.set(entry.originalWord, entry);

                            // Also store cleaned version (without vowel points for Hebrew)
                            const cleaned = entry.originalWord.replace(/[\u0591-\u05C7]/g, '');
                            if (cleaned !== entry.originalWord) {
                                wordMap.set(cleaned, entry);
                            }
                        }

                        // Store by Strong's number too
                        if (entry.strongsNumber) {
                            wordMap.set(entry.strongsNumber, entry);
                        }
                    });

                    // Update global cache
                    globalDictionary = dictionary;
                    globalWordMap = wordMap;
                    globalLoaded = true;

                    setState({
                        dictionary,
                        wordMap,
                        loaded: true,
                        loading: false,
                        error: null
                    });

                    console.log(`✅ Word dictionary loaded: ${dictionary.length} entries`);
                } else {
                    throw new Error(json.error || 'Failed to load dictionary');
                }
            } catch (error) {
                console.error('Failed to load word dictionary:', error);
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to load word dictionary'
                }));
            }
        };

        loadDictionary();
    }, []);

    /**
     * Lookup a word by its Hebrew/Greek text or Strong's number
     */
    const lookupWord = useCallback((word: string): WordMeaning | null => {
        if (!word) return null;

        // Try exact match
        let meaning = state.wordMap.get(word);
        if (meaning) return meaning;

        // Try without vowel points
        const cleaned = word.replace(/[\u0591-\u05C7]/g, '');
        meaning = state.wordMap.get(cleaned);
        if (meaning) return meaning;

        // Try partial match (word contains or is contained)
        for (const [key, entry] of state.wordMap) {
            if (key.includes(word) || word.includes(key)) {
                return entry;
            }
        }

        return null;
    }, [state.wordMap]);

    /**
     * Lookup multiple words at once
     */
    const lookupWords = useCallback((words: string[]): Map<string, WordMeaning> => {
        const results = new Map<string, WordMeaning>();

        words.forEach(word => {
            const meaning = lookupWord(word);
            if (meaning) {
                results.set(word, meaning);
            }
        });

        return results;
    }, [lookupWord]);

    /**
     * Search dictionary by English or Telugu meaning
     */
    const searchByMeaning = useCallback((query: string, limit = 20): WordMeaning[] => {
        if (!query) return [];

        const lowerQuery = query.toLowerCase();

        return state.dictionary
            .filter(entry =>
                entry.englishMeaning.toLowerCase().includes(lowerQuery) ||
                entry.teluguMeaning.includes(query) ||
                entry.teluguWord.includes(query)
            )
            .slice(0, limit);
    }, [state.dictionary]);

    return {
        dictionary: state.dictionary,
        loaded: state.loaded,
        loading: state.loading,
        error: state.error,
        lookupWord,
        lookupWords,
        searchByMeaning
    };
}

export default useWordDictionary;
