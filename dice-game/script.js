"use strict";

// player1 has active class by default which means it gets first chance to roll the dice
const player1 = document.getElementById("player-1");
const player1ScoreDice = document.querySelector("#player-1 .score-dice");
const player1ScoreTotal = document.querySelector("#player-1 .score-total");
const player2 = document.getElementById("player-2");
const player2ScoreDice = document.querySelector("#player-2 .score-dice");
const player2ScoreTotal = document.querySelector("#player-2 .score-total");
let turnPlayer1 = true;  // true means player1's turn and false means player2's turn
const reloadBtn = document.getElementById("reload-btn");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const holdBtn = document.getElementById("hold-btn");
const main = document.querySelector("main");
const diceImage = document.querySelector(".dice-image");
const colorWin = getComputedStyle(document.body).getPropertyValue("--clr-accent-win");


const generateRandomInteger = () => {
    // generates a random integer between 1 and 6
    return Math.floor(Math.random() * 6 + 1);
};


const changeActivePlayer = () => {
    turnPlayer1 = !turnPlayer1;

    if (turnPlayer1) {
        // player1's turn
        player1.classList.add("active");
        player2.classList.remove("active");
        player2ScoreDice.textContent = 0;
    }
    else {
        // player2's turn
        player2.classList.add("active");
        player1.classList.remove("active");
        player1ScoreDice.textContent = 0;
    }
}


const checkWin = (scoreTotal, playerDiv) => {
    if (scoreTotal >= 100) {
        playerDiv.style.backgroundColor = colorWin;
        rollDiceBtn.disabled = true;
        holdBtn.disabled = true;
    }
}


reloadBtn.onclick = () => {
    location.reload();
};


rollDiceBtn.onclick = () => {
    const randomInteger = generateRandomInteger();
    diceImage.src = `images/dice-${randomInteger}.png`;
    diceImage.style.visibility='visible';

    if (randomInteger === 1) {
        changeActivePlayer();
    }
    else {
        if (turnPlayer1) {
            player1ScoreDice.textContent = Number(player1ScoreDice.textContent) + randomInteger;
        }
        else {
            player2ScoreDice.textContent = Number(player2ScoreDice.textContent) + randomInteger;
        }
    }
};

holdBtn.onclick = () => {
    if (turnPlayer1) {
        player1ScoreTotal.textContent = Number(player1ScoreTotal.textContent) + Number(player1ScoreDice.textContent);
        checkWin(Number(player1ScoreTotal.textContent), player1);
    }
    else {
        player2ScoreTotal.textContent = Number(player2ScoreTotal.textContent) + Number(player2ScoreDice.textContent);
        checkWin(Number(player2ScoreTotal.textContent), player2);
    }
    changeActivePlayer();
};
