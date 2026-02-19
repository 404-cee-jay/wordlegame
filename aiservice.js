// aiService.js
async function fetchDailyWord(difficulty = 'normal') {
    try {
        const today = new Date().toISOString().split('T')[0];
        // Include difficulty in seed so same date = different word per difficulty
        const seed = today.split('-').join('') + difficulty; 
        
        // Build API URL based on difficulty
        let apiUrl = 'https://api.datamuse.com/words?sp=?????&max=100';
        
        if (difficulty === 'easy') {
            // More common words with higher frequency
            apiUrl += '&topics=common';
        } else if (difficulty === 'hard') {
            // Less common words with lower frequency
            apiUrl += '&md=f'; // Get frequency data to filter
        }
        
        const response = await fetch(apiUrl);
        const words = await response.json();
        
        if (words.length === 0) {
            throw new Error('No words found');
        }
        
        // Filter for hard mode (low frequency words)
        let filteredWords = words;
        if (difficulty === 'hard' && words.length > 0) {
            // Get words with lower frequency (more obscure)
            filteredWords = words.filter(w => !w.tags || !w.tags.includes('f:'));
            if (filteredWords.length === 0) {
                filteredWords = words.slice(50); // Use second half (less common)
            }
        }
        
        const index = Math.abs(hashCode(seed)) % filteredWords.length;
        const wordObj = filteredWords[index];
        
        const defResponse = await fetch(`https://api.datamuse.com/words?sp=${wordObj.word}&md=d&max=1`);
        const defData = await defResponse.json();
        
        return {
            word: wordObj.word.toUpperCase(),
            hint: defData[0]?.defs?.[0]?.replace(/^[a-z]\t/, '') || "A 5-letter word",
            difficulty: difficulty
        };
    } catch (error) {
        console.error('Error fetching word:', error);
        return {
            word: "REACT",
            hint: "A JavaScript library for building user interfaces",
            difficulty: difficulty
        };
    }
}

// Simple hash function for consistent daily words
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}