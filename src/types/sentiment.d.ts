declare module 'sentiment' {
    interface SentimentResult {
        score: number; // Overall score of sentiment
        comparative: number; // Comparative score
        tokens: string[]; // Array of all tokens
        words: string[]; // Array of recognized words
        positive: string[]; // Array of positive words
        negative: string[]; // Array of negative words
    }

    class Sentiment {
        analyze(
            text: string,
            options?: Record<string, number>
        ): SentimentResult;
    }

    export default Sentiment;
}
