














var height = 6;
var width = 5;
var row = 0;
var col = 0;

var gameOver = false;
var word = "APPLE"; // This should be replaced with a random word from a list

window.onload = function() {
    initialze();

}

function initialze() {
    for(let r =0; r < height; r++) {
        for(let c =0; c <width; c++){
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    //listen

    document.addEventListener("keyup", (e) => {
        if(gameOver) return;
        
        if("KeyA" <= e.code && e.code <= "KeyZ") {
            if(col < width) {
                let currentTile = document.getElementById(row.toString() + "-" + col.toString());
                if(currentTile.innerText == "") {
                    currentTile.innerText = e.code[3];
                    col += 1;
                }
            }   
        }
        else if (e.code == "Backspace") {
            if(0 < col && col <= width){
                col -= 1;
                let currentTile = document.getElementById(row.toString() + "-" + col.toString());
                currentTile.innerText = "";
            }
            }

            else if (e.code == "Enter") {
                update();
                row += 1;
                col =0;

            }
            if(!gameOver && row == height) {
                gameOver = true;
                document.getElementById("answer").innerText = "The word was " + word;
            }

    });
}


update = function() {
    let correct = 0;
    for(let c=0 ; c < width ; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;

        if(word[c] == letter) {
            currentTile.classList.add("correct");
            correct += 1;
        }
        else if(word.includes(letter)) {
            currentTile.classList.add("present");
        }
        else {
            currentTile.classList.add("absent");
        }


        if(correct == width) {
            gameOver = true;
            document.getElementById("answer").innerText = "Correct!";
        }
    }

}
