const header = document.querySelector("header");
const navMenu = document.querySelector("nav");
const hamburgerMenu = document.getElementById("hamburger-menu");
const navLinks = document.querySelectorAll(".main-menu ul li");
const navBtn = document.querySelector(".main-menu button");
const sectionHero = document.querySelector('.section-hero');
const cta = document.getElementById("cta");


function modifyNav() {
  if (navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
  }
}


hamburgerMenu.onclick = () => {
  navMenu.classList.toggle("active");
};


navLinks.forEach(link => {
  link.addEventListener("click", () => {
    modifyNav();
  });
});

navBtn.onclick = () => {
  document.getElementById('cta').scrollIntoView();
  modifyNav();
}


// Using Intersection Observer API
const observer = new window.IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    header.classList.remove("sticky");
    return
  }
  header.classList.add("sticky");
}, {
  root: null,
  threshold: 0, // set offset 0.1 means trigger if at least 10% of element in viewport
  rootMargin: "-80px",
});  

observer.observe(sectionHero);


// checking whether for viewport > 900px, nav bar is still active or not
// because if it's active, scroll will be disabled, so we need to remove it
window.onresize = () => {
  if (window.innerWidth > 900 && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
  }
};