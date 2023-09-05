const whiteKeys = document.querySelectorAll(".white-keys kbd");
const blackKeys = document.querySelectorAll(".black-keys kbd");

function changeWhiteKeys(index) {
    whiteKeys[index].classList.add("active-white-keys");
    setTimeout(function () {
        whiteKeys[index].classList.remove("active-white-keys");
    }, 300);
}

function changeBlackKeys(index) {
    blackKeys[index].classList.add("active-black-keys");
    setTimeout(function () {
        blackKeys[index].classList.remove("active-black-keys");
    }, 300);
}

// click functionality
whiteKeys.forEach((whiteKey, index) => {
    whiteKey.addEventListener("click", (e) => {
        const audio = new Audio(`./src/audio/${e.target.textContent}.mp3`);
        audio.play();
        changeWhiteKeys(index);
    });
});

blackKeys.forEach((blackKey, index) => {
    blackKey.addEventListener("click", (e) => {
        const audio = new Audio(`./src/audio/${e.target.textContent}.mp3`);
        audio.play();
        changeBlackKeys(index);
    });
});

// keyboard functionality
document.addEventListener("keydown", function (event) {
    switch (event.code) {
        // White keys
        case "KeyA":
            const audioA = new Audio("./src/audio/A.mp3");
            changeWhiteKeys(0);
            audioA.play();
            break;
        case "KeyS":
            const audioS = new Audio("./src/audio/S.mp3");
            audioS.play();
            changeWhiteKeys(1);
            break;
        case "KeyD":
            const audioD = new Audio("./src/audio/D.mp3");
            audioD.play();
            changeWhiteKeys(2);
            break;
        case "KeyF":
            const audioF = new Audio("./src/audio/F.mp3");
            audioF.play();
            changeWhiteKeys(3);
            break;
        case "KeyG":
            const audioG = new Audio("./src/audio/G.mp3");
            audioG.play();
            changeWhiteKeys(4);
            break;
        case "KeyH":
            const audioH = new Audio("./src/audio/H.mp3");
            audioH.play();
            changeWhiteKeys(5);
            break;
        case "KeyJ":
            const audioJ = new Audio("./src/audio/J.mp3");
            audioJ.play();
            changeWhiteKeys(6);
            break;
        // Black keys
        case "KeyW":
            const audioW = new Audio("./src/audio/W.mp3");
            audioW.play();
            changeBlackKeys(0);
            break;
        case "KeyE":
            const audioE = new Audio("./src/audio/E.mp3");
            audioE.play();
            changeBlackKeys(1);
            break;
        case "KeyT":
            const audioT = new Audio("./src/audio/T.mp3");
            audioT.play();
            changeBlackKeys(2);
            break;
        case "KeyY":
            const audioY = new Audio("./src/audio/Y.mp3");
            audioY.play();
            changeBlackKeys(3);
            break;
        case "KeyU":
            const audioU = new Audio("./src/audio/U.mp3");
            audioU.play();
            changeBlackKeys(4);
            break;
        default:
            break;
    }
});
