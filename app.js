let gameState = {
    targetWord: "",
    hint: "",
    difficulty: "normal",
    currentRow: 0,
    guesses: ['', '', '', '', '', ''],
    currentGuess: '',
    gameOver: false,
    isReplay: false,
    replayDate: null
};

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

let keyboardState = {}; // Track letter states for keyboard colors

// ========== LOCALSTORAGE MANAGEMENT ==========

function loadSettings() {
    const saved = localStorage.getItem('wordleSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        gameState.difficulty = settings.difficulty || 'normal';
        applyTheme(settings.theme || 'dark');
        return settings;
    }
    return { theme: 'dark', difficulty: 'normal' };
}

function saveSettings(settings) {
    localStorage.setItem('wordleSettings', JSON.stringify(settings));
}

function getDifficultyLockout() {
    const saved = localStorage.getItem('difficultyLockout');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

function setDifficultyLockout(difficulty) {
    const lockout = {
        difficulty: difficulty,
        lockedUntil: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    localStorage.setItem('difficultyLockout', JSON.stringify(lockout));
}

function getArchive() {
    const saved = localStorage.getItem('wordleArchive');
    if (saved) {
        return JSON.parse(saved);
    }
    return [];
}

function saveToArchive(gameData) {
    if (gameState.isReplay) return; // Don't save replays
    
    const archive = getArchive();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if today's game already exists
    const existingIndex = archive.findIndex(item => 
        item.date === today && item.difficulty === gameState.difficulty
    );
    
    const entry = {
        date: today,
        word: gameState.targetWord,
        difficulty: gameState.difficulty,
        guesses: gameState.guesses.filter(g => g !== ''),
        won: gameData.won,
        attempts: gameState.currentRow
    };
    
    if (existingIndex >= 0) {
        archive[existingIndex] = entry;
    } else {
        archive.push(entry);
    }
    
    // Keep only last 365 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 365);
    const filtered = archive.filter(item => new Date(item.date) >= cutoffDate);
    
    localStorage.setItem('wordleArchive', JSON.stringify(filtered));
    updateStats(gameData);
}

function getStats() {
    const saved = localStorage.getItem('wordleStats');
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        easy: { played: 0, won: 0, currentStreak: 0, maxStreak: 0, lastPlayDate: null },
        normal: { played: 0, won: 0, currentStreak: 0, maxStreak: 0, lastPlayDate: null },
        hard: { played: 0, won: 0, currentStreak: 0, maxStreak: 0, lastPlayDate: null }
    };
}

function updateStats(gameData) {
    if (gameState.isReplay) return;
    
    const stats = getStats();
    const diff = gameState.difficulty;
    const today = new Date().toISOString().split('T')[0];
    
    stats[diff].played++;
    if (gameData.won) {
        stats[diff].won++;
        
        // Update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (stats[diff].lastPlayDate === yesterdayStr || stats[diff].lastPlayDate === today) {
            stats[diff].currentStreak++;
        } else {
            stats[diff].currentStreak = 1;
        }
        
        stats[diff].maxStreak = Math.max(stats[diff].maxStreak, stats[diff].currentStreak);
    } else {
        stats[diff].currentStreak = 0;
    }
    
    stats[diff].lastPlayDate = today;
    localStorage.setItem('wordleStats', JSON.stringify(stats));
}

// ========== THEME MANAGEMENT ==========

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.checked = theme === 'light';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    
    const settings = loadSettings();
    settings.theme = newTheme;
    saveSettings(settings);
}

// ========== DIFFICULTY MANAGEMENT ==========

function updateDifficultyBadge() {
    const badge = document.getElementById('difficulty-badge');
    const diffText = gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
    badge.textContent = `🎯 ${diffText} Mode`;
    badge.className = `badge diff-badge ${gameState.difficulty}`;
}

function checkDifficultyLockout() {
    const lockout = getDifficultyLockout();
    const warning = document.getElementById('lockout-warning');
    
    if (lockout && Date.now() < lockout.lockedUntil) {
        const remaining = lockout.lockedUntil - Date.now();
        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        
        warning.innerHTML = `🔒 Difficulty locked to <strong>${lockout.difficulty}</strong> for ${days}d ${hours}h`;
        warning.style.display = 'block';
        
        // Disable non-matching radio buttons
        document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
            if (radio.value !== lockout.difficulty) {
                radio.disabled = true;
                radio.parentElement.style.opacity = '0.5';
            } else {
                radio.checked = true;
            }
        });
        
        return lockout.difficulty;
    } else {
        warning.style.display = 'none';
        document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
            radio.disabled = false;
            radio.parentElement.style.opacity = '1';
        });
        return null;
    }
}

function changeDifficulty(newDifficulty) {
    const lockout = getDifficultyLockout();
    
    if (lockout && Date.now() < lockout.lockedUntil && lockout.difficulty !== newDifficulty) {
        alert('❌ Difficulty is locked! You cannot change it until the lockout expires.');
        checkDifficultyLockout(); // Restore correct selection
        return;
    }
    
    gameState.difficulty = newDifficulty;
    setDifficultyLockout(newDifficulty);
    
    const settings = loadSettings();
    settings.difficulty = newDifficulty;
    saveSettings(settings);
    
    updateDifficultyBadge();
    
    // Reload game with new difficulty
    if (!gameState.isReplay) {
        initGame();
    }
}

// ========== GAME INITIALIZATION ==========

async function initGame(replayData = null) {
    // Reset state
    keyboardState = {};
    gameState.currentRow = 0;
    gameState.guesses = ['', '', '', '', '', ''];
    gameState.currentGuess = '';
    gameState.gameOver = false;
    
    if (replayData) {
        // Replay mode
        gameState.isReplay = true;
        gameState.replayDate = replayData.date;
        gameState.targetWord = replayData.word;
        gameState.hint = "Replaying past challenge";
        gameState.difficulty = replayData.difficulty;
    } else {
        // Normal daily mode
        gameState.isReplay = false;
        gameState.replayDate = null;
        
        // Check if already played today
        const today = new Date().toISOString().split('T')[0];
        const archive = getArchive();
        const todayGame = archive.find(item => 
            item.date === today && item.difficulty === gameState.difficulty
        );
        
        if (todayGame) {
            // Show completed game
            gameState.targetWord = todayGame.word;
            gameState.hint = "Already completed today!";
            gameState.guesses = [...todayGame.guesses];
            while (gameState.guesses.length < 6) {
                gameState.guesses.push('');
            }
            gameState.currentRow = todayGame.attempts;
            gameState.gameOver = true;
            
            // Restore keyboard state
            todayGame.guesses.forEach(guess => {
                for (let i = 0; i < guess.length; i++) {
                    const letter = guess[i];
                    if (letter === gameState.targetWord[i]) {
                        keyboardState[letter] = 'correct';
                    } else if (gameState.targetWord.includes(letter)) {
                        if (keyboardState[letter] !== 'correct') {
                            keyboardState[letter] = 'present';
                        }
                    } else {
                        if (!keyboardState[letter]) {
                            keyboardState[letter] = 'absent';
                        }
                    }
                }
            });
            
            renderGrid();
            renderKeyboard();
            return;
        }
        
        const data = await fetchDailyWord(gameState.difficulty);
        gameState.targetWord = data.word;
        gameState.hint = data.hint;
    }
    
    console.log('Target word:', gameState.targetWord);
    document.getElementById('hint').style.display = 'none';
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

// Submit guess
function submitGuess() {
    gameState.guesses[gameState.currentRow] = gameState.currentGuess;
    
    const won = gameState.currentGuess === gameState.targetWord;
    gameState.currentRow++;
    
    // Show hint on 4th guess
    if (gameState.currentRow === 4 && !won && !gameState.isReplay) {
        document.getElementById('hint').textContent = `💡 Hint: ${gameState.hint}`;
        document.getElementById('hint').style.display = 'block';
    }
    
    gameState.currentGuess = '';
    renderGrid();
    renderKeyboard();
    
    if (won) {
        gameState.gameOver = true;
        saveToArchive({ won: true });
        setTimeout(() => {
            const msg = gameState.isReplay 
                ? '🎉 Replay completed!' 
                : '🎉 Congratulations! You won!';
            alert(msg);
        }, 500);
    } else if (gameState.currentRow === 6) {
        gameState.gameOver = true;
        saveToArchive({ won: false });
        setTimeout(() => {
            const msg = gameState.isReplay
                ? `Replay Over! The word was: ${gameState.targetWord}`
                : `😔 Game Over! The word was: ${gameState.targetWord}`;
            alert(msg);
        }, 500);
    }
}

// ========== UI MANAGEMENT ==========

function openSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.add('active');
    checkDifficultyLockout();
    renderArchive();
    renderStats();
}

function closeSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.remove('active');
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Refresh tab content
    if (tabName === 'archive') {
        renderArchive();
    } else if (tabName === 'stats') {
        renderStats();
    } else if (tabName === 'difficulty') {
        checkDifficultyLockout();
    }
}

function renderArchive() {
    const archiveList = document.getElementById('archive-list');
    const archive = getArchive().sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (archive.length === 0) {
        archiveList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No games played yet!</p>';
        return;
    }
    
    archiveList.innerHTML = archive.map(item => `
        <div class="archive-item">
            <div class="archive-info">
                <div class="archive-date">${item.date} <span class="diff-badge ${item.difficulty}">${item.difficulty}</span></div>
                <div class="archive-word" id="word-${item.date}-${item.difficulty}">
                    <span style="filter: blur(5px);">${item.word}</span>
                    <button class="btn-small" onclick="revealWord('${item.date}', '${item.difficulty}')">Show</button>
                </div>
                <div class="archive-status">${item.won ? '✅ Won' : '❌ Lost'} - ${item.attempts} ${item.attempts === 1 ? 'try' : 'tries'}</div>
                <div class="guess-grid">
                    ${item.guesses.map(guess => {
                        let html = '';
                        for (let i = 0; i < guess.length; i++) {
                            const letter = guess[i];
                            let className = 'mini-cell ';
                            if (letter === item.word[i]) className += 'correct';
                            else if (item.word.includes(letter)) className += 'present';
                            else className += 'absent';
                            html += `<div class="${className}"></div>`;
                        }
                        return html;
                    }).join('')}
                </div>
            </div>
            <div class="archive-actions">
                <button class="btn-small" onclick="replayGame('${item.date}', '${item.difficulty}')">🔄 Replay</button>
            </div>
        </div>
    `).join('');
}

function revealWord(date, difficulty) {
    const archive = getArchive();
    const item = archive.find(a => a.date === date && a.difficulty === difficulty);
    if (item) {
        const wordEl = document.getElementById(`word-${date}-${difficulty}`);
        wordEl.innerHTML = `<strong>${item.word}</strong>`;
    }
}

function replayGame(date, difficulty) {
    const archive = getArchive();
    const item = archive.find(a => a.date === date && a.difficulty === difficulty);
    if (item) {
        closeSettings();
        initGame(item);
    }
}

function renderStats() {
    const statsContainer = document.getElementById('stats-container');
    const stats = getStats();
    const currentDiff = gameState.difficulty;
    const diffStats = stats[currentDiff];
    
    const winRate = diffStats.played > 0 
        ? Math.round((diffStats.won / diffStats.played) * 100) 
        : 0;
    
    statsContainer.innerHTML = `
        <div class="stat-box">
            <span class="stat-value">${diffStats.played}</span>
            <div class="stat-label">Games Played</div>
        </div>
        <div class="stat-box">
            <span class="stat-value">${winRate}%</span>
            <div class="stat-label">Win Rate</div>
        </div>
        <div class="stat-box">
            <span class="stat-value">${diffStats.currentStreak}</span>
            <div class="stat-label">Current Streak</div>
        </div>
        <div class="stat-box">
            <span class="stat-value">${diffStats.maxStreak}</span>
            <div class="stat-label">Max Streak</div>
        </div>
    `;
}

// ========== EVENT LISTENERS ==========

// Settings button
document.getElementById('settings-btn').addEventListener('click', openSettings);

// Close modal
document.querySelector('.close-btn').addEventListener('click', closeSettings);
document.getElementById('settings-modal').addEventListener('click', (e) => {
    if (e.target.id === 'settings-modal') {
        closeSettings();
    }
});

// Theme toggle
document.getElementById('theme-toggle').addEventListener('change', toggleTheme);

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
    });
});

// Difficulty selection
document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        changeDifficulty(e.target.value);
    });
});

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

// ========== INITIALIZATION ==========

// Load settings and start game
const settings = loadSettings();
gameState.difficulty = checkDifficultyLockout() || settings.difficulty;
updateDifficultyBadge();

// Set correct radio button
document.querySelector(`input[name="difficulty"][value="${gameState.difficulty}"]`).checked = true;

// Make functions globally accessible for onclick handlers
window.revealWord = revealWord;
window.replayGame = replayGame;

// Start game
initGame();