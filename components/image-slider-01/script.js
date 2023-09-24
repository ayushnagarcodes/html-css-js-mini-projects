let imgArray = [
    "./images/img1.jpg",
    "./images/img2.jpg",
    "./images/img3.jpg",
    "./images/img4.jpg",
    "./images/img5.jpg",
];
let cardMainImg = document.querySelector(".card-main img");
let rightArrow = document.querySelector(".right-arrow");
let leftArrow = document.querySelector(".left-arrow");
let counter = 0;
let arrIndex = 0;
let containerList = document.querySelectorAll(".container");
let totalCardCount = document.querySelector(".card-count--total");
let currentCardCount = document.querySelector(".card-count--current");
let card2 = document.getElementById("card-2");
let card5 = document.getElementById("card-5");

function checkArrIndex() {
    if (arrIndex < 0) {
        arrIndex += 5;
    } else if (arrIndex === 0) {
        arrIndex = 0;
    }
}

function clickRightArrow() {
    rightArrow.click();
}
card2.addEventListener("click", clickRightArrow);

function clickLeftArrow() {
    leftArrow.click();
}
card5.addEventListener("click", clickLeftArrow);

function updateCard2() {
    card2.removeEventListener("click", clickRightArrow);
    card2 = document.getElementById("card-2");
    card2.addEventListener("click", clickRightArrow);
}

function updateCard5() {
    card5.removeEventListener("click", clickLeftArrow);
    card5 = document.getElementById("card-5");
    card5.addEventListener("click", clickLeftArrow);
}

function changeSliderImg() {
    containerList.forEach((element, index) => {
        let num = (index + 1 - arrIndex) % 5;
        if (num <= 0) {
            num += 5;
        }
        element.setAttribute("id", `card-${num}`);
    });
}

function changeCardCount() {
    currentCardCount.innerText = arrIndex + 1;
    totalCardCount.innerText = containerList.length;
}

rightArrow.onclick = () => {
    counter++;
    arrIndex = counter % 5;
    checkArrIndex();
    cardMainImg.src = imgArray[arrIndex];
    changeSliderImg();
    changeCardCount();
    updateCard2();
    updateCard5();
};

leftArrow.onclick = () => {
    counter--;
    arrIndex = counter % 5;
    checkArrIndex();
    cardMainImg.src = imgArray[arrIndex];
    changeSliderImg();
    changeCardCount();
    updateCard2();
    updateCard5();
};
