document.querySelectorAll("a").forEach((el) => {
    el.addEventListener("click", (e) => {
        e.preventDefault();
    });
});

// Menu 1
const navMenu1 = document.querySelector(".menu-1 .nav");
const plusBtnMenu1 = document.querySelector(".menu-1 .plus-btn");
const iconsMenu1 = document.querySelectorAll(".menu-1 .icon");

plusBtnMenu1.onclick = () => {
    navMenu1.classList.toggle("active");
};

iconsMenu1.forEach((element, index) => {
    element.addEventListener("click", () => {
        document.querySelector(".menu-1 .focus").classList.remove("focus");
        element.classList.add("focus");

        let root = document.querySelector(":root");
        root.style.setProperty("--angle", `${45 * index}deg`);
    });
});

// Menu 2
const navMenu2 = document.querySelector(".menu-2 .nav");
const openerMenu2 = document.querySelector(".menu-2 .opener");
openerMenu2.addEventListener("click", () => {
    navMenu2.classList.toggle("active");
});

// Menu 3
let iconMenu3 = document.querySelectorAll(".menu-3 .icon");
iconMenu3.forEach((element, index) => {
    element.addEventListener("click", () => {
        document.querySelector(".menu-3 .active").classList.remove("active");
        element.classList.add("active");

        const root = document.querySelector(":root");
        root.style.setProperty("--distance", `${70 * index}px`);
    });
});

// Menu 4
const navMenu4 = document.querySelector(".menu-4 .nav");
const openerMenu4 = document.querySelector(".menu-4 .opener");
openerMenu4.onclick = () => {
    navMenu4.classList.toggle("active");
    if (navMenu4.classList.contains("active")) {
        openerMenu4.firstElementChild.textContent = "Close";
    } else {
        openerMenu4.firstElementChild.textContent = "Menu";
    }
};

// Menu 5
const burgerMenu5 = document.querySelector(".menu-5 .burger-menu");
const toggleBtnMenu5 = document.querySelector(".menu-5 .toggle-btn");

toggleBtnMenu5.onclick = () => {
    burgerMenu5.classList.toggle("active");
};

// Menu 6
const navMenu6 = document.querySelector(".menu-6 .nav-container");
const openerMenu6 = document.querySelector(".menu-6 .opener");
openerMenu6.onclick = () => {
    navMenu6.classList.toggle("active");
}