"use strict";

let workoutData, map, tempCoords, dataID;
const zoomLevel = 13;
const logo = document.querySelector(".logo");
const form = document.querySelector("form");
const selectType = document.getElementById("type");
const inputDistance = document.getElementById("distance");
const inputDuration = document.getElementById("duration");
const divInputCadence = document.getElementById("only-running");
const divInputElevGain = document.getElementById("only-cycling");
const listContainer = document.querySelector(".list-container");

const d = new Date();
const currentDate = `${d.toDateString().split(" ")[1]} ${
    d.toDateString().split(" ")[2]
}`;

// rendering list item from data
const renderListItem = (inputData) => {
    // compiling output data in an object
    const outputData = {};

    // assigning values to outputData object according to workout type
    if (inputData.type === "Running") {
        outputData.class = "running-popup";
        outputData.popupContent = `🏃‍♂️ Running on ${inputData.date}`;
        outputData.listHTML = `
                <li class="list-item running-item" data-id="${inputData.id}">
                    <p class="title">Running on ${inputData.date}</p>
                    <p class="subtitle">
                        <span class="value">🏃‍♂️ ${
                            inputData.distance
                        } <span class="unit">KM</span></span>
                        <span class="value">⏱ ${
                            inputData.duration
                        } <span class="unit">MIN</span></span>
                        <span class="value">⚡️ ${(
                            inputData.duration / inputData.distance
                        ).toFixed(1)} <span class="unit">MIN/KM</span></span>
                        <span class="value">🦶🏼 ${
                            inputData.cadence
                        } <span class="unit">SPM</span></span>
                    </p>
                </li>`;
    }
    if (inputData.type === "Cycling") {
        outputData.class = "cycling-popup";
        outputData.popupContent = `🚴‍♀️ Cycling on ${inputData.date}`;
        outputData.listHTML = `
                <li class="list-item cycling-item" data-id="${inputData.id}">
                    <p class="title">Cycling on ${inputData.date}</p>
                    <p class="subtitle">
                        <span class="value">🏃‍♂️ ${
                            inputData.distance
                        } <span class="unit">KM</span></span>
                        <span class="value">⏱ ${
                            inputData.duration
                        } <span class="unit">MIN</span></span>
                        <span class="value">⚡️ ${(
                            (inputData.distance * 60) /
                            inputData.duration
                        ).toFixed(1)} <span class="unit">KM/H</span></span>
                        <span class="value">⛰ ${
                            inputData.elevGain
                        } <span class="unit">M</span></span>
                    </p>
                </li>`;
    }

    // adding marker
    L.marker(inputData.coords)
        .addTo(map)
        .bindPopup(
            L.popup({
                maxWidth: 250,
                minWidth: 100,
                closeOnClick: false,
                autoClose: false,
                className: outputData.class,
            })
        )
        .setPopupContent(outputData.popupContent)
        .openPopup();

    // adding list item
    listContainer.insertAdjacentHTML("afterbegin", outputData.listHTML);
};

// Program start
// accessing geolocation of the user
navigator.geolocation.getCurrentPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];

        map = L.map("map").setView(coords, zoomLevel);

        // https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // adding click event listener to map
        map.on("click", (mapEvent) => {
            const { lat, lng } = mapEvent.latlng;
            // storing lat, lng in temp variable so that it can be reused in case of wrong input in the form
            tempCoords = [lat, lng];

            // modifying form
            form.classList.remove("hidden");
            inputDistance.focus();
        });

        // rendering list items saved in localStorage after loading page
        if (localStorage.workout) {
            workoutData = JSON.parse(localStorage.workout);
            workoutData.forEach((data) => {
                renderListItem(data);
            });
            dataID = workoutData.at(-1).id + 1;
        } else {
            workoutData = [];
            dataID = 1;
        }
    },
    () => {
        alert("Could not get your position");
    }
);

// listening for any change in the 'selectType' field and toggling input field accordingly
selectType.addEventListener("input", () => {
    divInputCadence.classList.toggle("hidden-input");
    divInputElevGain.classList.toggle("hidden-input");
    inputDistance.focus();
});

// resetting & hiding form
const resetForm = () => {
    form.classList.add("hidden");
    form.reset();
    // making the 'cadence' input field visible and 'elev-gain' hidden as 'Running' will be set in 'selectType'
    if (divInputCadence.classList.contains("hidden-input")) {
        divInputCadence.classList.toggle("hidden-input");
        divInputElevGain.classList.toggle("hidden-input");
    }
};

// listening for form submission
form.addEventListener("submit", (event) => {
    let stop = false;
    event.preventDefault();

    // checking for negative and empty values
    const inputArr = document.querySelectorAll("form input");
    inputArr.forEach((el) => {
        // negative elev-gain is accepted in case of cycling
        if (
            (Number(el.value) <= 0 &&
                !el.parentElement.classList.contains("hidden-input") &&
                el.id !== "elev-gain") ||
            (selectType.value === "Cycling" &&
                el.value === "" &&
                el.id === "elev-gain")
        ) {
            if (!stop) alert("Enter values greater than or equal to zero!");
            el.value = "";
            stop = true;
        }
    });
    if (stop) return;

    // compiling input data in an object
    const inputDataObj = {
        id: dataID,
        type: selectType.value,
        distance: inputDistance.value,
        duration: inputDuration.value,
        date: currentDate,
        coords: tempCoords,
    };

    // assigning values to inputDataObj object according to workout type
    if (inputDataObj.type === "Running") {
        inputDataObj.cadence = document.getElementById("cadence").value;
    }
    if (inputDataObj.type === "Cycling") {
        inputDataObj.elevGain = document.getElementById("elev-gain").value;
    }

    // rendering list item
    renderListItem(inputDataObj);

    // adding inputDataObj to workoutData array to store it in localStorage
    workoutData.push(inputDataObj);
    localStorage.workout = JSON.stringify(workoutData);

    // increasing dataID counter for unique ID's
    dataID++;

    // resetting & hiding form
    resetForm();
});

// hitting 'Esc' key will exit/hide the form before submitting
form.addEventListener("keydown", (event) => {
    if (event.code === "Escape" && !form.classList.contains("hidden")) {
        // resetting & hiding form
        resetForm();
    }
});

// using event delegation to implement ->
// clicking 'list-item' will move the map to corresponding 'marker/popup' associated with it
// It can also be done by adding event listener to each 'list-item' upon creation. But that will be inefficient.
listContainer.addEventListener("click", (event) => {
    const listItem = event.target.closest(".list-item");

    // if 'listItem' is null, then return
    if (!listItem) return;

    const dataObj = workoutData.find((obj) => obj.id == listItem.dataset.id);
    map.setView(dataObj.coords, zoomLevel, {
        animate: true,
        pan: {
            duration: 1,
        },
    });
});
