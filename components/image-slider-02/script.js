let cardsArr = document.querySelectorAll(".card");
let leftArrow = document.querySelector(".left-arrow");
let rightArrow = document.querySelector(".right-arrow");
let dotsArr = document.querySelectorAll(".dot");
let index = 0;

function checkIndex() {
  if (index < 0) {
    index = 0;
  } else if (index > cardsArr.length - 1) {
    index = 2;
  }
}

function changeActiveDot() {
  let activeDot = document.querySelector(".active-dot");
  activeDot.classList.remove("active-dot");
  dotsArr[index].classList.add("active-dot");
}

function checkArrows() {
  if (index <= 0) {
    leftArrow.classList.add("deactivate");
  } else if (index > 0) {
    leftArrow.classList.remove("deactivate");
  }
  
  if (index >= cardsArr.length - 1) {
    rightArrow.classList.add("deactivate");
  } else if (index < cardsArr.length - 1) {
    rightArrow.classList.remove("deactivate");
  }
}

rightArrow.onclick = () => {
  index++;
  checkIndex();

  cardsArr[index].classList.add("active-next");
  setTimeout(() => {
    let activeCardNext = document.querySelector(".active-next");
    activeCardNext.style.visibility = "visible";
    activeCardNext.classList.remove("active-next");
  }, 1000);

  changeActiveDot();
  checkArrows();
};

leftArrow.onclick = () => {
  cardsArr[index].classList.add("active-previous");
  setTimeout(() => {
    let activeCardPrevious = document.querySelector(".active-previous");
    activeCardPrevious.style.visibility = "hidden";
    activeCardPrevious.classList.remove("active-previous");
  }, 1000);

  index--;
  checkIndex();
  changeActiveDot();
  checkArrows();
};

dotsArr.forEach((element, dotsArrIndex) => {
  element.addEventListener("click", () => {
    let activeDot = document.querySelector(".active-dot");
    activeDot.classList.remove("active-dot");
    element.classList.add("active-dot");
    
    let shift = Math.abs(index - dotsArrIndex);
    if (dotsArrIndex > index) {
      for (let i = 0; i < shift; i++) {
        rightArrow.click();
      }
    } else if (dotsArrIndex < index) {
      for (let i = 0; i < shift; i++) {
        leftArrow.click();
      }
    }
  });
});
