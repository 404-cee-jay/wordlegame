# Wordle Game - Feature Documentation

## 🎮 New Features Implemented

### 1. **Theme Toggle (Dark/Light Mode)**
- **Location**: Settings → Theme tab
- **Functionality**: 
  - Toggle between dark mode (neon purple aesthetic) and light mode (soft cream/pastel)
  - Theme persists across sessions via localStorage
  - Smooth 0.3s transition animations
  - Uses CSS custom properties for instant switching
- **How to Use**: Click ⚙️ icon → Theme tab → Toggle switch

---

### 2. **Difficulty System with 7-Day Lockout**
- **Location**: Settings → Difficulty tab
- **Difficulty Levels**:
  - **Easy**: Common 5-letter words (uses Datamuse `topics=common` filter)
  - **Normal**: Balanced word selection (default)
  - **Hard**: Obscure & challenging words (low-frequency vocabulary)
- **7-Day Lockout Rule**:
  - When you change difficulty, it locks for 7 days
  - Countdown timer shows remaining time (e.g., "Locked for 3d 5h")
  - Prevents frequent switching to maintain competitive integrity
  - After 7 days, you can change difficulty again
- **Implementation**: 
  - Each difficulty generates different daily word using hash-based seeding
  - Lockout stored in localStorage with timestamp
  - Radio buttons disabled during lockout period
- **How to Use**: Click ⚙️ → Difficulty → Select mode (locks for 7 days)

---

### 3. **Word Archive & Replay System**
- **Location**: Settings → Archive tab
- **Features**:
  - View all past daily challenges (up to 365 days)
  - Shows date, difficulty badge, win/loss status, attempts
  - Word initially blurred with "Show" button to reveal
  - Visual mini-grid showing colored guess history
  - **Replay Mode**: Click "🔄 Replay" to play any past word again
  - Replays don't affect stats or streaks
- **Storage**: 
  - Automatically saves every completed game to localStorage
  - Includes word, difficulty, guesses, result, date
  - Rolling 365-day window (older entries auto-deleted)
- **How to Use**: Click ⚙️ → Archive → Browse history → Click replay button

---

### 4. **Statistics Tracking**
- **Location**: Settings → Stats tab
- **Metrics (Per Difficulty)**:
  - **Games Played**: Total games completed
  - **Win Rate**: Percentage of wins
  - **Current Streak**: Consecutive daily wins
  - **Max Streak**: Best streak ever achieved
- **Streak Logic**:
  - Increments if you play and win consecutive days
  - Resets to 0 on a loss
  - Separate stats for Easy/Normal/Hard
- **Persistence**: All stats saved to localStorage permanently

---

## 🔧 Technical Implementation

### **localStorage Keys**
```javascript
wordleSettings       // { theme: 'dark'|'light', difficulty: 'easy'|'normal'|'hard' }
difficultyLockout    // { difficulty: string, lockedUntil: timestamp }
wordleArchive        // Array of { date, word, difficulty, guesses, won, attempts }
wordleStats          // { easy: {...}, normal: {...}, hard: {...} }
```

### **CSS Variables (Theme System)**
- `:root` (dark mode) and `[data-theme="light"]` (light mode)
- All colors use `var(--primary)`, `var(--correct-start)`, etc.
- JavaScript toggles `data-theme` attribute on `<html>`

### **Difficulty Word Fetching**
- Uses Datamuse API with difficulty-specific filters
- Hash function ensures same date + difficulty = consistent word
- Easy mode: `topics=common` parameter
- Hard mode: Filters for low-frequency words

### **Replay vs Daily Mode**
- `gameState.isReplay = true` prevents saving to archive/stats
- Replay uses stored word instead of fetching new one
- UI shows different messages ("Replay completed!" vs "You won!")

---

## 🎨 UI Enhancements

1. **Settings Modal**
   - Centered overlay with blur backdrop
   - Tabbed interface (Theme/Difficulty/Archive/Stats)
   - Responsive design (mobile-friendly)
   - Smooth animations (fadeIn, slideDown)

2. **Difficulty Badges**
   - Color-coded: Easy (purple), Normal (blue), Hard (red)
   - Shown in main UI and archive list
   - Visual indication of current mode

3. **Archive Cards**
   - Hover effects with border glow
   - Mini guess grid with colored tiles
   - Blurred word reveal for spoiler protection

4. **Stats Grid**
   - 2x2 grid layout (1 column on mobile)
   - Large numbers with labels
   - Real-time updates after each game

---

## 📱 Responsive Design

- **Desktop**: Archive/hint on left, game in center
- **Tablet (< 1200px)**: Archive moves to top
- **Mobile (< 600px)**: 
  - Smaller cells (50x50px)
  - Single-column stats
  - Full-width modals
  - Compact keyboard

---

## 🚀 Usage Tips

1. **First Time Setup**: Game starts in Normal difficulty, Dark theme
2. **Changing Difficulty**: Choose carefully - locks for 7 days!
3. **Daily Play**: Complete today's word before it saves to archive
4. **Theme Switch**: Instant toggle, no page reload needed
5. **Archive Browsing**: Use Show button to reveal words without spoilers
6. **Replay**: Practice old words without affecting your stats

---

## 🔒 Data Privacy

All data stored locally in browser's localStorage:
- No server communication (except Datamuse API for word fetching)
- No user accounts or tracking
- Clear localStorage to reset everything

---

## 🐛 Known Limitations

1. Datamuse API sometimes returns limited words (fallback: "REACT")
2. Archive limited to 365 days (auto-cleanup)
3. No word validation (any 5 letters accepted)
4. Stats are per-browser (don't sync across devices)

---

## 📝 Developer Notes

### File Structure
```
wordlegame/
├── index.html       # HTML structure with settings modal
├── styles.css       # CSS with theme variables
├── app.js          # Game logic + UI management
└── aiservice.js    # Word fetching with difficulty support
```

### Key Functions
- `loadSettings()` / `saveSettings()` - Persistence
- `applyTheme()` / `toggleTheme()` - Theme switching
- `checkDifficultyLockout()` - 7-day enforcement
- `saveToArchive()` / `getArchive()` - Game history
- `updateStats()` / `getStats()` - Statistics tracking
- `initGame(replayData)` - Replay support
- `renderArchive()` / `renderStats()` - UI rendering

### Future Enhancements
- Share results (emoji grid like real Wordle)
- Word validation using dictionary API
- Custom word lists
- Leaderboards (requires backend)
- Dark/light/custom themes
- Export/import archive data
