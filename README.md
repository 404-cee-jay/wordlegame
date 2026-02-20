# 🎮 Wordle Game

A feature-rich Wordle clone with multiple game modes, difficulty levels, and comprehensive tracking features.

## ✨ Features

### Game Modes
- **Classic Mode** - One daily puzzle per difficulty level (resets every 24 hours)
- **Endless Mode** - Unlimited games with random words

### Difficulty Levels
- **Easy** - Common everyday words
- **Normal** - Standard vocabulary
- **Hard** - Obscure and challenging words
- **Difficulty Lock** - 7-day lockout when changing difficulty (Classic mode only)

### Core Features
- 🎯 6 attempts to guess a 5-letter word
- 💡 Hint system (appears on 4th guess)
- 🎨 Color-coded feedback (Correct, Present, Absent)
- ⌨️ Virtual and physical keyboard support
- 🎭 Dark/Light theme toggle
- 📊 Statistics tracking per difficulty
- 📜 Game archive with replay functionality
- 🎉 Confetti animation on wins
- 🔄 Reset game functionality

### Advanced Features
- **Statistics Dashboard**
  - Games played & win rate
  - Current & max streak tracking
  - Separate stats for Classic and Endless modes
  
- **Archive System**
  - View past games (up to 365 days)
  - Replay previous puzzles
  - Blur/reveal word functionality
  - Visual guess history with color coding

- **LocalStorage Persistence**
  - Settings preservation
  - Game history
  - Statistics tracking
  - Difficulty lockout enforcement

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js and npm (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/404-cee-jay/wordlegame.git
   cd wordlegame
   ```

2. **Set up the backend** (Optional - for word validation)
   ```bash
   # If using Node.js backend
   npm install
   npm start
   ```

3. **Open the game**
   - For local development: Open `index.html` in your browser
   - For production: Deploy to any static hosting service

## 📁 Project Structure

```
wordlegame/
├── index.html          # Main HTML structure
├── app.js              # Game logic and UI
├── styles.css          # Styling and themes
├── aiservice.js        # Word generation service (Datamuse API)
└── README.md           # This file
```

## 🎮 How to Play

1. **Start the Game**
   - The game loads automatically with a random 5-letter word
   - Choose your game mode and difficulty in Settings

2. **Make a Guess**
   - Type a 5-letter word using your keyboard or the on-screen keyboard
   - Press ENTER to submit

3. **Read the Feedback**
   - 🟩 **Green** - Letter is correct and in the right position
   - 🟨 **Yellow** - Letter is in the word but wrong position
   - ⬜ **Gray** - Letter is not in the word

4. **Win or Lose**
   - Win by guessing the word within 6 attempts
   - Get a hint on your 4th guess (if still playing)
   - View the answer after all attempts are used

## ⚙️ Settings

### Theme Tab
- Toggle between Dark and Light mode
- Preference saved locally

### Game Mode Tab
- **Classic Mode** - Daily puzzle that tracks progress
- **Endless Mode** - Unlimited random words

### Difficulty Tab
- Select Easy, Normal, or Hard difficulty
- View difficulty lockout status (Classic mode)
- Lockout prevents changes for 7 days

### Archive Tab
- Browse past games by date
- Replay completed puzzles
- Reveal/hide past answers
- View guess patterns

### Stats Tab
- **Classic Mode Stats** (per difficulty)
  - Games played
  - Win percentage
  - Current streak
  - Max streak
  
- **Endless Mode Stats**
  - Total games played
  - Best score (based on guess count)

## 🔧 API Integration

### Word Generation
The game uses the Datamuse API for word generation:
- **Easy Mode**: Common, high-frequency words
- **Normal Mode**: Standard vocabulary
- **Hard Mode**: Less common, challenging words

### API Endpoints (Backend)
```javascript
GET /api/daily-word?difficulty=<easy|normal|hard>
GET /api/random-word?difficulty=<easy|normal|hard>
GET /api/validate-word?word=<WORD>
```

### Fallback System
If API fails, the game uses hardcoded fallback words:
- Easy: APPLE, BREAD, CHAIR, etc.
- Normal: BRAIN, STORM, FRAME, etc.
- Hard: FJORD, LYMPH, WALTZ, etc.

## 🎨 Customization

### Themes
Edit CSS variables in `styles.css`:
```css
[data-theme='dark'] {
  --bg-primary: #121213;
  --text-primary: #ffffff;
  --correct: #538d4e;
  --present: #b59f3b;
  --absent: #3a3a3c;
}
```

### Word Lists
Modify fallback words in `app.js`:
```javascript
const fallbackWords = {
    easy: [{ word: "APPLE", hint: "A common fruit" }],
    normal: [{ word: "BRAIN", hint: "Organ for thinking" }],
    hard: [{ word: "FJORD", hint: "Narrow inlet of sea" }]
};
```

## 🐛 Known Issues & Limitations

- Word validation requires backend API (allows any 5 letters as fallback)
- Datamuse API has rate limits (consider caching results)
- LocalStorage has size limits (~5-10MB depending on browser)
- Archive limited to 365 days

## 🚀 Future Enhancements

- [ ] Multiplayer mode
- [ ] Leaderboards
- [ ] Share results to social media
- [ ] Multiple language support
- [ ] Hard mode (use revealed clues in subsequent guesses)
- [ ] Color-blind friendly mode
- [ ] Sound effects
- [ ] Achievements system

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👏 Acknowledgments

- Inspired by the original [Wordle](https://www.nytimes.com/games/wordle/index.html) by Josh Wardle
- Word data provided by [Datamuse API](https://www.datamuse.com/api/)
- Built with vanilla JavaScript, HTML5, and CSS3

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Enjoy playing! 🎉**
