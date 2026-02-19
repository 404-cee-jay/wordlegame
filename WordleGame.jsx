import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { fetchDailyWord } from './aiservice';
import { ThreeDHint } from './ThreeDHint';

function WordleGame() {
    const [gameState, setGameState] = useState({
        targetWord: "",
        hint: "",
        currentRow: 0,
        guesses: ['', '', '', '', '', ''],
        currentGuess: '',
        showHint: false,
        gameOver: false
    });

    // Fetch AI word on load
    useEffect(() => {
        fetchDailyWord().then(data => {
            console.log('Word loaded:', data.word); // Debug
            setGameState(prev => ({
                ...prev,
                targetWord: data.word,
                hint: data.hint
            }));
        });
    }, []);

    // Show hint on 4th guess
    useEffect(() => {
        if (gameState.currentRow === 3) {
            setGameState(prev => ({ ...prev, showHint: true }));
        }
    }, [gameState.currentRow]);

    // Handle keyboard input
    const handleKeyPress = (e) => {
        if (gameState.gameOver) return;

        if (e.key === 'Enter' && gameState.currentGuess.length === 5) {
            submitGuess();
        } else if (e.key === 'Backspace') {
            setGameState(prev => ({
                ...prev,
                currentGuess: prev.currentGuess.slice(0, -1)
            }));
        } else if (/^[a-zA-Z]$/.test(e.key) && gameState.currentGuess.length < 5) {
            setGameState(prev => ({
                ...prev,
                currentGuess: prev.currentGuess + e.key.toUpperCase()
            }));
        }
    };

    const submitGuess = () => {
        const newGuesses = [...gameState.guesses];
        newGuesses[gameState.currentRow] = gameState.currentGuess;

        const won = gameState.currentGuess === gameState.targetWord;
        const gameOver = won || gameState.currentRow === 5;

        setGameState(prev => ({
            ...prev,
            guesses: newGuesses,
            currentRow: prev.currentRow + 1,
            currentGuess: '',
            gameOver: gameOver
        }));

        if (won) {
            alert('You won! 🎉');
        } else if (gameOver) {
            alert(`Game Over! The word was ${gameState.targetWord}`);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameState.currentGuess, gameState.gameOver]);

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#121213', position: 'relative' }}>
            {/* Wordle Grid */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                paddingTop: '50px',
                gap: '5px'
            }}>
                <h1 style={{ color: 'white', marginBottom: '20px' }}>WORDLE</h1>
                
                {gameState.guesses.map((guess, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex', gap: '5px' }}>
                        {[0, 1, 2, 3, 4].map(colIndex => {
                            const letter = rowIndex === gameState.currentRow 
                                ? gameState.currentGuess[colIndex] || ''
                                : guess[colIndex] || '';
                            
                            let bgColor = '#3a3a3c';
                            if (rowIndex < gameState.currentRow && letter) {
                                if (letter === gameState.targetWord[colIndex]) {
                                    bgColor = '#538d4e'; // Green
                                } else if (gameState.targetWord.includes(letter)) {
                                    bgColor = '#b59f3b'; // Yellow
                                } else {
                                    bgColor = '#3a3a3c'; // Gray
                                }
                            }

                            return (
                                <div key={colIndex} style={{
                                    width: '60px',
                                    height: '60px',
                                    border: '2px solid #565758',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    backgroundColor: bgColor
                                }}>
                                    {letter}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Three.js Canvas for AI Hint */}
            <div style={{ 
                position: 'absolute', 
                bottom: '100px', 
                left: '0', 
                right: '0', 
                height: '200px',
                pointerEvents: 'none'
            }}>
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <ThreeDHint hint={gameState.hint} visible={gameState.showHint} />
                </Canvas>
            </div>
        </div>
    );
}

export default WordleGame;