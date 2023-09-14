const slider = document.querySelector(".slider");
const form = document.querySelector(".form");
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const findMeBtn = document.getElementById("find-me-btn");
const submitBtn = document.getElementById("submit-btn");
const backBtn = document.getElementById("back-btn");
const errPopup = document.querySelector(".error-popup");
const cardContainer = document.querySelector(".card-container");

errPopup.querySelector("img").addEventListener("click", () => {
    errPopup.classList.add("hidden");
});

const showError = (el, message) => {
    el.querySelector("span").innerText = message;
    el.classList.remove("hidden");
    return;
};

const checkInputValues = () => {
    if (
        isNaN(latitude.value) ||
        isNaN(longitude.value) ||
        latitude.value === "" ||
        longitude.value === "" ||
        latitude.value > 90 ||
        latitude.value < -90 ||
        longitude.value > 180 ||
        longitude.value < -180
    ) {
        showError(errPopup, "Wrong input values!");
        return false;
    } else {
        return true;
    }
};

const displayCard = (geoLocation, dataObj) => {
    const card = `
        <article class="card">
            <img class="country-flag" src="${dataObj.flags.png}" alt="country flag">

            <div class="location">
                <h1 class="country-name">${dataObj.name.common}</h1>
                <h2>Your Location</h2>
                <p>${geoLocation}</p>
            </div>

            <div class="country-info">
                <h2>Country Details</h2>
                <p>Capital: ${dataObj.capital[0]}</p>
                <p>Region: ${dataObj.subregion}</p>
                <p>Timezone: ${dataObj.timezones[0]}</p>
            </div>
        </article>
    `;
    cardContainer.querySelectorAll(".card").forEach((el) => el.remove());
    cardContainer.insertAdjacentHTML("afterbegin", card);
};

// implementation using async + await
const getCountryDetails = async (countryName, locationDetails) => {
    try {
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}`
        );
        if (!response.ok) throw new Error("Something went wrong!");

        const data = await response.json();

        // it returns more than one countries (in case of India, etc.)
        // so, checking that the object is of the correct country
        let index;
        data.forEach((obj, i) => {
            if (
                obj.name.common === countryName ||
                obj.name.official === countryName ||
                obj.altSpellings.includes(countryName)
            ) {
                index = i;
                return;
            }
        });

        displayCard(locationDetails, data[index]);
        slider.classList.add("active");
        form.reset();
    } catch (err) {
        showError(errPopup, "Location not found!");
        console.error("Fetch 2:", err.message);
    }
};

// implementation using async + await
const reverseGeocode = async () => {
    try {
        const response = await fetch(
            `https://geocode.xyz/${latitude.value},${longitude.value}?json=1&auth=161224511659307274977x38979`
        );
        if (!response.ok) throw new Error("Something went wrong");

        const data = await response.json();

        let location, country;

        if (data.error) throw new Error("Not Found!");

        if (data.standard) {
            location = `${data.standard.addresst}, ${data.standard.city}, ${data.standard.countryname}, ${data.standard.postal}`;
            country = data.standard.countryname;
        } else if (data.city === data.state) {
            location = `${data.staddress}, ${data.city}, ${data.country}, ${data.postal}`;
            country = data.country;
        } else {
            location = `${data.staddress}, ${data.city}, ${data.state}, ${data.country}, ${data.postal}`;
            country = data.country;
        }

        // getting country details
        getCountryDetails(country, location);
    } catch (err) {
        showError(errPopup, "Location not found!");
        console.error("Fetch 1:", err.message);
    }
};

findMeBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude: lat, longitude: long } = position.coords;
            latitude.value = lat;
            longitude.value = long;
            submitBtn.click();
        },
        () => {
            alert("Could not get your position");
        }
    );
});

submitBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // checking for correct input values
    if (!checkInputValues()) return;

    // hiding previously active error messages if input is correct
    if (!errPopup.classList.contains("hidden")) {
        errPopup.classList.add("hidden");
    }

    // fetching data & handling errors
    reverseGeocode();
});

backBtn.addEventListener("click", () => {
    slider.classList.remove("active");
});

// implementation using then/catch
/*
const getCountryDetails = (countryName, locationDetails) => {
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then((response) => {
            if (!response.ok) throw new Error("Something went wrong!");
            return response.json();
        })
        .then((data) => {
            // it returns more than one countries (in case of India, etc.)
            // so, checking that the object is of the correct country
            let index;
            data.forEach((obj, i) => {
                if (obj.name.common === countryName || obj.name.official === countryName || obj.altSpellings.includes(countryName)) {
                    index = i;
                    return;
                }
            });

            displayCard(locationDetails, data[index]);
            slider.classList.add("active");
            form.reset();
        })
        .catch((err) => {
            showError(errPopup, "Location not found!");
            console.error("Fetch 2:", err.message);
        });
};

const reverseGeocode = () => {
    fetch(
        `https://geocode.xyz/${latitude.value},${longitude.value}?json=1&auth=161224511659307274977x38979`
    )
        .then((response) => {
            if (!response.ok) throw new Error("Something went wrong!");
            return response.json();
        })
        .then((data) => {
            let location, country;

            if (data.error) throw new Error("Not Found!");

            if (data.standard) {
                location = `${data.standard.addresst}, ${data.standard.city}, ${data.standard.countryname}, ${data.standard.postal}`;
                country = data.standard.countryname;
            } else if (data.city === data.state) {
                location = `${data.staddress}, ${data.city}, ${data.country}, ${data.postal}`;
                country = data.country;
            } else {
                location = `${data.staddress}, ${data.city}, ${data.state}, ${data.country}, ${data.postal}`;
                country = data.country;
            }

            // getting country details
            getCountryDetails(country, location);
        })
        .catch((err) => {
            showError(errPopup, "Location not found!");
            console.error("Fetch 1:", err.message);
        });
};
*/
