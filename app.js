let gameState = {
    targetWord: "",
    hint: "",
    currentRow: 0,
    guesses: ['', '', '', '', '', ''],
    currentGuess: '',
    gameOver: false
};

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

let keyboardState = {}; // Track letter states for keyboard colors

// Initialize game
async function initGame() {
    const data = await fetchDailyWord();
    gameState.targetWord = data.word;
    gameState.hint = data.hint;
    console.log('Target word:', data.word);
    renderGrid();
    renderKeyboard();
}

// Render grid
function renderGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    
    for (let row = 0; row < 6; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // Show current guess
            if (row === gameState.currentRow) {
                cell.textContent = gameState.currentGuess[col] || '';
                if (gameState.currentGuess[col]) {
                    cell.classList.add('filled');
                }
            } else if (row < gameState.currentRow) {
                const letter = gameState.guesses[row][col];
                cell.textContent = letter;
                
                // Color coding with animation
                if (letter === gameState.targetWord[col]) {
                    cell.classList.add('correct');
                    keyboardState[letter] = 'correct';
                } else if (gameState.targetWord.includes(letter)) {
                    cell.classList.add('present');
                    if (keyboardState[letter] !== 'correct') {
                        keyboardState[letter] = 'present';
                    }
                } else {
                    cell.classList.add('absent');
                    if (!keyboardState[letter]) {
                        keyboardState[letter] = 'absent';
                    }
                }
                cell.classList.add('flip');
            }
            
            rowDiv.appendChild(cell);
        }
        grid.appendChild(rowDiv);
    }
}

// Render keyboard
function renderKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    
    KEYBOARD_ROWS.forEach(row => {
        const keyRow = document.createElement('div');
        keyRow.className = 'keyboard-row';
        
        row.forEach(key => {
            const keyButton = document.createElement('button');
            keyButton.className = 'key';
            keyButton.textContent = key;
            
            // Apply keyboard state colors
            if (keyboardState[key]) {
                keyButton.classList.add(keyboardState[key]);
            }
            
            if (key === 'ENTER' || key === '⌫') {
                keyButton.classList.add('wide-key');
            }
            
            keyButton.addEventListener('click', () => handleKeyClick(key));
            keyRow.appendChild(keyButton);
        });
        
        keyboard.appendChild(keyRow);
    });
}

// Handle key clicks
function handleKeyClick(key) {
    if (gameState.gameOver) return;
    
    if (key === 'ENTER') {
        if (gameState.currentGuess.length === 5) {
            submitGuess();
        }
    } else if (key === '⌫') {
        gameState.currentGuess = gameState.currentGuess.slice(0, -1);
        renderGrid();
    } else {
        if (gameState.currentGuess.length < 5) {
            gameState.currentGuess += key;
            renderGrid();
        }
    }
}

// Handle physical keyboard
document.addEventListener('keydown', (e) => {
    if (gameState.gameOver) return;

    if (e.key === 'Enter') {
        handleKeyClick('ENTER');
    } else if (e.key === 'Backspace') {
        handleKeyClick('⌫');
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyClick(e.key.toUpperCase());
    }
});

// Submit guess
function submitGuess() {
    gameState.guesses[gameState.currentRow] = gameState.currentGuess;
    
    const won = gameState.currentGuess === gameState.targetWord;
    gameState.currentRow++;
    
    // Show hint on 4th guess
    if (gameState.currentRow === 4 && !won) {
        document.getElementById('hint').textContent = `💡 Hint: ${gameState.hint}`;
        document.getElementById('hint').style.display = 'block';
    }
    
    gameState.currentGuess = '';
    renderGrid();
    renderKeyboard();
    
    if (won) {
        gameState.gameOver = true;
        setTimeout(() => alert('🎉 Congratulations! You won!'), 500);
    } else if (gameState.currentRow === 6) {
        gameState.gameOver = true;
        setTimeout(() => alert(`😔 Game Over! The word was: ${gameState.targetWord}`), 500);
    }
}

// Start game
initGame();