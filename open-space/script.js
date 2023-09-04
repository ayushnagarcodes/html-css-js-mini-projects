let rocket = document.querySelector(".rocket");
let passwordField = document.querySelector("input[type='password']");
let okBtn = document.getElementById("ok-btn");
let checkButtons = document.querySelectorAll("input[type='checkbox']");
let normalLevers = document.querySelectorAll(".levers input[type='range']");
let adjustSpeedLever = document.getElementById("adjust-speed-lever");
let adjustTrajectoryLever = document.getElementById("adjust-trajectory-lever");
let launchBtn = document.getElementById("launch-btn");
let reLaunchBtn = document.getElementById("relaunch-btn")


// Checking whether the password is correct or not
// Also, enabling several buttons
function checkPassword(btn) {
    if (passwordField.value === "LaunchIt") {
        passwordField.disabled = true;
        okBtn.disabled = true;

        checkButtons.forEach(function (element) {
            element.disabled = false;
        });

        normalLevers.forEach(function (element) {
           element.disabled = false; 
        });

        adjustSpeedLever.disabled = false;
        adjustTrajectoryLever.disabled = false;
    }
}


// Checking whether the required fields are in a required manner
// If yes, then enabling the Launch & Re-Launch button
document.addEventListener("input", function() {
    let checkBtnInPosition = 0;
    checkButtons.forEach(function (element) {
        if (element.checked) {
            checkBtnInPosition++;
        }
    });

    let leverInPosition = 0;
    normalLevers.forEach(function (element) {
        if (element.value == 100) {
            leverInPosition++;
        }
    });

    if (checkBtnInPosition === 3 && leverInPosition === 3) {
        launchBtn.disabled = false;
        reLaunchBtn.disabled = false;   
    }
    else {
        launchBtn.disabled = true;
        reLaunchBtn.disabled = true;
    }
});


// Adjusting speed
adjustSpeedLever.oninput = function() {
    if (Number(this.value) < 25) {
        this.value = 25;
    }

    switch (this.value) {
        case "25":
            this.previousElementSibling.innerHTML = "Slow";
            break;
        case "62.5":
            this.previousElementSibling.innerHTML = "Medium";
            break;
        case "100":
            this.previousElementSibling.innerHTML = "Fast";
            break;
    }
}


// Adjusting the trajectory angle
adjustTrajectoryLever.oninput = function() {
    if (Number(this.value) < 20) {
        this.value = 20;
    }
    this.previousElementSibling.innerHTML = this.value + " degree";

    rocket.style.transform = `rotateZ(${this.value}deg)`;
};


// Applying animation to rocket and count-down text
function launchRocket() {
    // Modifying rocket animation according to user input
    // According to speed
    switch (adjustSpeedLever.previousElementSibling.innerHTML) {
        case "Slow":
            rocket.style.animationDuration = "9s";
            break;
        case "Medium":
            rocket.style.animationDuration = "5s";
            break;
        case "Fast":
            rocket.style.animationDuration = "1s";
            break;
    }
    // According to trajectory angle
    switch (adjustTrajectoryLever.value) {
        // Final position for 20 degree angle
        case "20":
            document.documentElement.style.setProperty("--top-position", "-900px");
            document.documentElement.style.setProperty("--left-position", "300px");
            break;
        // Final position for 40 degree angle
        case "40":
            document.documentElement.style.setProperty("--top-position", "-500px");
            document.documentElement.style.setProperty("--left-position", "300px");
            break;
        // Final position for 60 degree angle
        case "60":
            document.documentElement.style.setProperty("--top-position", "-300px");
            document.documentElement.style.setProperty("--left-position", "1000px");
            break;
    }

    // Adding animation classes to rocket and count-down text
    document.getElementById("count-down-3").classList.add("animate-count-down-3");
    document.getElementById("count-down-2").classList.add("animate-count-down-2");
    document.getElementById("count-down-1").classList.add("animate-count-down-1");
    document.getElementById("lift-off").classList.add("animate-lift-off");
    rocket.classList.add("animation");
}


// Reloading page after clicking 'Re-Launch' button
function reload() {
    location.reload();
}


// okBtn is clicked, if 'Enter' key is pressed
document.addEventListener("keydown", function (event) {
    if (event.code == "Enter") {
        okBtn.click();
    }
});

