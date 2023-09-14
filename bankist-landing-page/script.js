// Elements
const navListItems = document.querySelectorAll("nav li");
const header = document.querySelector("header");
const heroSection = document.querySelector(".hero");
const revealSections = document.querySelectorAll("section:not(.hero)");
const lazyImages = document.querySelectorAll(".lazy-img")
const operationsBtns = document.querySelectorAll(".operations__btns > button");
let activeOperationsBtn = document.querySelector(".operations__btns > .active__btn");
const operationsContainers = document.querySelectorAll(".operations__container");
let activeOperation = document.querySelector(".operations__container.active__operation");
const btnSlideLeft = document.querySelector(".slide__left");
const btnSlideRight = document.querySelector(".slide__right");
const slider = document.querySelector(".slider");
const dots = document.querySelectorAll(".dot");
let sliderIndex = 0;
const btnsSignUp = document.querySelectorAll(".btn__sign-up");
const popup = document.querySelector(".popup");
const btnClosePopup = document.querySelector(".popup__btn--close");
const btnNext = document.querySelector(".popup__next-btn");



// Functions
const changeOpacity = (index, type) => {
    navListItems.forEach((el, i) => {
        if (type === "reduce") {
            if (i !== index) {
                el.style.opacity = 0.5;
            }
        } else if (type === "normal") {
            el.style.opacity = 1;
        }
    });
};



navListItems.forEach((el, i) => {
    el.addEventListener("mouseenter", () => {
        changeOpacity(i, "reduce");
    });

    el.addEventListener("mouseleave", () => {
        changeOpacity(i, "normal");
    });
});



// Using Intersection Observer API to implement sticky nav
const navHeight = document.querySelector('nav').getBoundingClientRect().height;
const observer = new window.IntersectionObserver(
    ([entry]) => {
        if (entry.isIntersecting) {
            header.classList.remove("sticky");
            return;
        }
        header.classList.add("sticky");
    },
    {
        root: null,
        threshold: 0, // set offset 0.1 means trigger if at least 10% of element in viewport
        rootMargin: `-${navHeight}px`,
    }
);

observer.observe(heroSection);



// Using Intersection Observer API to implement section reveal animation
const observeSections = new window.IntersectionObserver(
    (entries, observer) => {
        const [entry] = entries;

        if (!entry.isIntersecting) return;

        entry.target.classList.add('reveal-section');
        observer.unobserve(entry.target);
    },
    {
        root: null,
        threshold: 0.15,
    }
);

revealSections.forEach(el => observeSections.observe(el));



// Using Intersection Observer API to lazy load images
const lazyLoadImages = new window.IntersectionObserver(
    (entries, observer) => {
        const [entry] = entries;

        if (!entry.isIntersecting) return;

        // entry.target.setAttribute("src", entry.target.getAttribute("data-src"));
        entry.target.src = entry.target.dataset.src;
        entry.target.addEventListener('load', () => {
            entry.target.classList.remove("lazy-img");
        });

        observer.unobserve(entry.target);
    },
    {
        root: null,
        threshold: 0,
        rootMargin: '100px',
    }
);

lazyImages.forEach(el => lazyLoadImages.observe(el));



operationsBtns.forEach((el, i) => {
    el.addEventListener("click", (e) => {
        if (e.target !== activeOperationsBtn) {
            activeOperationsBtn.classList.remove("active__btn");
            e.target.classList.add("active__btn");
            activeOperationsBtn = e.target;

            activeOperation.classList.remove("active__operation");
            operationsContainers[i].classList.add("active__operation");
            activeOperation = operationsContainers[i];
        }
    });
});



btnSlideLeft.addEventListener("click", () => {
    dots[sliderIndex].classList.remove("active__dot");
    sliderIndex - 1 < 0 ? (sliderIndex = 2) : sliderIndex--;
    slider.style.setProperty("--i", sliderIndex);
    dots[sliderIndex].classList.add("active__dot");
});



btnSlideRight.addEventListener("click", () => {
    dots[sliderIndex].classList.remove("active__dot");
    sliderIndex + 1 > 2 ? (sliderIndex = 0) : sliderIndex++;
    slider.style.setProperty("--i", sliderIndex);
    dots[sliderIndex].classList.add("active__dot");
});



btnsSignUp.forEach((btn) => {
    btn.addEventListener("click", () => {
        popup.classList.add("active");
        document.body.style.overflowY = "hidden";
    });
});



btnClosePopup.addEventListener("click", () => {
    popup.classList.remove("active");
    document.body.style.overflowY = "scroll";
});



btnNext.addEventListener("click", (e) => {
    e.preventDefault();
});
