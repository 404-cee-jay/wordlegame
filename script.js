














// Declare the number of rows (attempts) in the game board
var height = 6;
// Declare the number of columns (letters in the word) in the game board
var width = 5;
// Track the current row (which attempt the player is on), starting at 0
var row = 0;
// Track the current column (which letter position within the current attempt), starting at 0
var col = 0;

// Flag to track whether the game has ended
var gameOver = false;
// The target word that the player needs to guess
var word = "APPLE"; // This should be replaced with a random word from a list

// Set up a function to run when the page finishes loading
window.onload = function() {
    // Call the initialize function to set up the game
    initialze();

}

// Function to initialize the game board and event listeners
function initialze() {
    // Outer loop: iterate through each row of the game board
    for(let r =0; r < height; r++) {
        // Inner loop: iterate through each column of the current row
        for(let c =0; c <width; c++){
            // Create a new span element to represent a tile
            let tile = document.createElement("span");
            // Set the tile's ID as "row-column" (e.g., "0-0", "0-1", etc.)
            tile.id = r.toString() + "-" + c.toString();
            // Add the "tile" CSS class to style the tile
            tile.classList.add("tile");
            // Initialize the tile's text content as empty
            tile.innerText = "";
            // Append the tile to the board element in the HTML
            document.getElementById("board").appendChild(tile);
        }
    }

    // Set up keyboard event listener for player input

    // Add an event listener that triggers when a key is released
    document.addEventListener("keyup", (e) => {
        // If the game is over, exit the function and ignore key presses
        if(gameOver) return;
        
        // Check if the pressed key is a letter (KeyA through KeyZ)
        if("KeyA" <= e.code && e.code <= "KeyZ") {
            // Check if there's still space in the current row for more letters
            if(col < width) {
                // Get the current tile element based on row and column position
                let currentTile = document.getElementById(row.toString() + "-" + col.toString());
                // Check if the current tile is empty
                if(currentTile.innerText == "") {
                    // Extract the letter from the key code (e.code[3] gets the letter from "KeyA")
                    currentTile.innerText = e.code[3];
                    // Move to the next column
                    col += 1;
                }
            }   
        }
        // Check if the Backspace key was pressed
        else if (e.code == "Backspace") {
            // Check if there are letters to delete (column is between 1 and width)
            if(0 < col && col <= width){
                // Move back one column
                col -= 1;
                // Get the tile element at the new column position
                let currentTile = document.getElementById(row.toString() + "-" + col.toString());
                // Clear the tile's text content
                currentTile.innerText = "";
            }
            }

            // Check if the Enter key was pressed
            else if (e.code == "Enter") {
                // Call the update function to check the guess
                update();
                // Move to the next row for the next guess
                row += 1;
                // Reset the column back to the start
                col =0;

            }
            // Check if the game should end (player used all attempts without winning)
            if(!gameOver && row == height) {
                // Set the game over flag to true
                gameOver = true;
                // Display the correct word to the player
                document.getElementById("answer").innerText = "The word was " + word;
            }

    });
}


function update() {
    let guess = "";
    for (let c = 0; c < width; c++) {
        let tile = document.getElementById(row + "-" + c);
        guess += tile.innerText;
    }

    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
        letterCount[word[i]] = (letterCount[word[i]] || 0) + 1;
    }

    let correctCount = 0;

    // Process each tile for animations
    for (let c = 0; c < width; c++) {
        let tile = document.getElementById(row + "-" + c);
        let letter = tile.innerText;

        // Apply animation with a staggered delay (0.1s, 0.2s, etc.)
        setTimeout(() => {
            tile.classList.add("flip");

            // Logic to change color midway through the flip
            if (word[c] === letter) {
                tile.classList.add("correct");
                correctCount++;
            } else if (word.includes(letter) && letterCount[letter] > 0) {
                tile.classList.add("present");
                letterCount[letter]--;
            } else {
                tile.classList.add("absent");
            }

            // Check win condition after the last tile flips
           /* if (c === width - 1) {
                if (correctCount === width) {
                    gameOver = true;
                    document.getElementById("answer").innerText = "Correct!";
                } else if (row === height - 1) {
                    gameOver = true;
                    document.getElementById("answer").innerText = "The word was " + word;
                }
            }*/
        }, c * 200); // 200ms gap between each tile
    }
}
