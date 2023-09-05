"use strict";

const CSSVariables = getComputedStyle(document.body);
const reloadBtn = document.getElementById("reload-btn");
const displayNum = document.getElementById("span-display");
const inputNum = document.getElementById("input-num");
const checkBtn = document.getElementById("check-btn");
const gameStatus = document.querySelector(".status");
const score = document.getElementById("span-score");
const highScore = document.getElementById("span-highscore");
const storedHighScore = localStorage.getItem("highScore");
const randomNum = Math.floor(Math.random() * 30 + 1);
let winStatus = false;

const updateHighScore = (value) => {
    localStorage.setItem("highScore", value);
};

if (!storedHighScore) {
    updateHighScore(0);
} else {
    highScore.textContent = storedHighScore;
}

reloadBtn.onclick = () => {
    location.reload();
};

const checkLost = (scoreValue) => {
    if (scoreValue - 1 === 0 && !winStatus) {
        gameStatus.textContent = "🥵 You lost!";
        document.body.style.backgroundColor =
            CSSVariables.getPropertyValue("--clr-accent-lose");
    }
};

checkBtn.onclick = () => {
    const scoreValue = Number(score.textContent);
    const inputValue = Number(inputNum.value);

    if (scoreValue > 0 && !winStatus && inputValue) {
        if (inputValue === randomNum) {
            gameStatus.textContent = "🎉 Correct Number!";
            document.body.style.backgroundColor =
                CSSVariables.getPropertyValue("--clr-accent-win");
            displayNum.textContent = randomNum;

            if (scoreValue > storedHighScore) {
                highScore.textContent = scoreValue;
                updateHighScore(scoreValue);
            }
            winStatus = true;
        } else if (inputValue < randomNum) {
            gameStatus.textContent = "📉 Too low!";
            score.textContent = scoreValue - 1;
            checkLost(scoreValue);
        } else if (inputValue > randomNum) {
            gameStatus.textContent = "📈 Too high!";
            score.textContent = scoreValue - 1;
            checkLost(scoreValue);
        }
    } else if (!inputValue) {
        gameStatus.textContent = "⛔ No Number!";
    }
};

document.addEventListener("keydown", (event) => {
    if (event.code == "Enter") {
        checkBtn.click();
    }
});
