import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BibleBook, BibleVerse, bibleAPI } from '../api/bibleApi';

interface BibleContextType {
    currentBook: BibleBook | null;
    currentChapter: number;
    currentVerse: BibleVerse | null;
    setBook: (book: BibleBook) => void;
    setChapter: (chapter: number) => void;
    setVerse: (verse: BibleVerse | null) => void;
    loading: boolean;
    books: BibleBook[];
    error: string | null;
    goToVerse: (bookName: string, chapter: number, verse: number) => void;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export function BibleProvider({ children }: { children: ReactNode }) {
    const [books, setBooks] = useState<BibleBook[]>([]);
    const [currentBook, setCurrentBook] = useState<BibleBook | null>(null);
    const [currentChapter, setCurrentChapter] = useState(1);
    const [currentVerse, setCurrentVerse] = useState<BibleVerse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function init() {
            try {
                setLoading(true);
                const booksData = await bibleAPI.getBooks();
                setBooks(booksData);
                if (booksData.length > 0) {
                    // Restore from local storage or default to Genesis
                    const savedBookId = localStorage.getItem('bible-mind-book-id');
                    const savedChapter = localStorage.getItem('bible-mind-chapter');

                    if (savedBookId) {
                        const book = booksData.find(b => b.bookId === parseInt(savedBookId));
                        if (book) setCurrentBook(book);
                        else setCurrentBook(booksData[0]);
                    } else {
                        setCurrentBook(booksData[0]);
                    }

                    if (savedChapter) {
                        setCurrentChapter(parseInt(savedChapter));
                    }
                } else {
                    setError("No books found.");
                }
            } catch (err) {
                console.error("Failed to load books", err);
                setError("Failed to load Bible data.");
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    // Save state
    useEffect(() => {
        if (currentBook) localStorage.setItem('bible-mind-book-id', currentBook.bookId.toString());
        localStorage.setItem('bible-mind-chapter', currentChapter.toString());
    }, [currentBook, currentChapter]);

    const goToVerse = (bookName: string, chapter: number, verseNum: number) => {
        const book = books.find(b => b.bookName === bookName || b.shortName === bookName);
        if (book) {
            setCurrentBook(book);
            setCurrentChapter(chapter);
            // We can't set the full verse object here easily without fetching, 
            // but usually we just want to navigate to the chapter and highlight.
            // For highlighting, we might need a separate 'highlightVerseId' state or logic in Reader.
            // For now, we assume Reader can handle scrolling to verse if passed.
        }
    };

    return (
        <BibleContext.Provider value={{
            currentBook,
            currentChapter,
            currentVerse,
            setBook: setCurrentBook,
            setChapter: setCurrentChapter,
            setVerse: setCurrentVerse,
            loading,
            books,
            error,
            goToVerse
        }}>
            {children}
        </BibleContext.Provider>
    );
}

export function useBible() {
    const context = useContext(BibleContext);
    if (context === undefined) {
        throw new Error('useBible must be used within a BibleProvider');
    }
    return context;
}
