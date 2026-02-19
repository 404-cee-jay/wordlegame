
async function getDailyWordFromAI() {
    const today = new Date().toISOString().split('T')[0];
    
    // In a real app, you'd call your backend here to protect your API Key
    // This is the logic the AI would follow:
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `Generate a 5-letter word and hint for ${today} in JSON format.` }]
            }]
        })
    });

    const data = await response.json();
    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    
    return {
        word: result.word.toUpperCase(),
        hint: result.hint
    };
}