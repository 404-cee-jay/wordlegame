// aiService.js
const API_KEY = "YOUR_GEMINI_API_KEY";
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function fetchDailyWord() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const seed = today.split('-').join(''); // e.g., "20260219"
        
        const response = await fetch('https://api.datamuse.com/words?sp=?????&max=100');
        const words = await response.json();
        
        if (words.length === 0) {
            throw new Error('No words found');
        }
        
        const index = parseInt(seed) % words.length;
        const wordObj = words[index];
        
        const defResponse = await fetch(`https://api.datamuse.com/words?sp=${wordObj.word}&md=d&max=1`);
        const defData = await defResponse.json();
        
        return {
            word: wordObj.word.toUpperCase(),
            hint: defData[0]?.defs?.[0]?.replace(/^[a-z]\t/, '') || "A common 5-letter word"
        };
    } catch (error) {
        console.error('Error fetching word:', error);
        return {
            word: "REACT",
            hint: "A JavaScript library for building user interfaces"
        };
    }
}