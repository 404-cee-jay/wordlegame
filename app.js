
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





import React, { useRef } from 'react'
import { Text, Float } from '@react-three/drei'

export function ThreeDHint({ hint, visible }) {
  if (!visible) return null;

  return (
    <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        fontSize={0.5}
        color="#00ffcc"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
        textAlign="center"
        font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8p-8ad8z076Y2Ma29vhc.woff"
      >
        {hint}
      </Text>
    </Float>
  )
}



import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { fetchDailyWord } from './aiService';
import { ThreeDHint } from './ThreeDHint';

function WordleGame() {
    const [gameState, setGameState] = useState({
        targetWord: "",
        hint: "",
        currentRow: 0,
        showHint: false
    });

    // 1. Fetch AI word on load
    useEffect(() => {
        fetchDailyWord().then(data => {
            setGameState(prev => ({
                ...prev,
                targetWord: data.word.toUpperCase(),
                hint: data.hint
            }));
        });
    }, []);

    // 2. Logic to trigger hint on 4th guess
    useEffect(() => {
        if (gameState.currentRow === 3) {
            setGameState(prev => ({ ...prev, showHint: true }));
        }
    }, [gameState.currentRow]);

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#121213' }}>
            {/* Standard UI for Wordle Grid Goes Here */}
            <div id="grid"> {/* Your Grid Components */} </div>

            {/* Three.js Canvas for the AI Hint */}
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                
                <ThreeDHint 
                    hint={gameState.hint} 
                    visible={gameState.showHint} 
                />
            </Canvas>
        </div>
    );
}

export default WordleGame;


// In your index.js or main entry file