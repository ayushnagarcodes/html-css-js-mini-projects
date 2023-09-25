// Button-03
let btn3 = document.querySelector(".btn-container.btn-3 button");
let stateBtn3 = localStorage.getItem("btn3-state");

if (stateBtn3 == null) {
    stateBtn3 = "dark";
    localStorage.setItem("btn3-state", stateBtn3);
} else if (stateBtn3 === "light") {
    btn3.parentElement.classList.add("active");
}

btn3.onclick = () => {
    if (stateBtn3 === "dark") {
        btn3.parentElement.classList.add("active");
        stateBtn3 = "light";
    } else if (stateBtn3 === "light") {
        btn3.parentElement.classList.remove("active");
        stateBtn3 = "dark";
    }
    localStorage.setItem("btn3-state", stateBtn3);
};

// Button-04
let btn4 = document.querySelector(".btn-container.btn-4 button");
btn4.onclick = () => {
    btn4.classList.toggle("active");
};
