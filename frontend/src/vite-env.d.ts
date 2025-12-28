/// <reference types="vite/client" />

declare namespace Intl {
    interface SegmenterOptions {
        localeMatcher?: 'best fit' | 'lookup';
        granularity?: 'grapheme' | 'word' | 'sentence';
    }

    interface Segmenter {
        segment(input: string): Segments;
    }

    interface Segments {
        [Symbol.iterator](): IterableIterator<SegmentData>;
    }

    interface SegmentData {
        segment: string;
        index: number;
        input: string;
    }

    const Segmenter: {
        prototype: Segmenter;
        new(locales?: string | string[], options?: SegmenterOptions): Segmenter;
    };
}
