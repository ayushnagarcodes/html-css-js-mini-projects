const API_KEY = "0afaa6c5-0a80-49e1-9285-acfc974a57e9";
const mainContainer = document.querySelector("main");
const logo = document.querySelector(".logo");
const searchBar = document.getElementById("search");
const showBookmarksBtn = document.getElementById("show-bookmarks--btn");
const slider = document.querySelector(".slider");
const bookmarksList = document.querySelector(".bookmarks-list");
const mealsListContainer = document.querySelector(".meals-list");
const recipeDetailsContainer = document.querySelector(".recipe-details");
const mealsLoaderHTML = `
    <svg class="meals-list--loader">
        <use href="./images/icons.svg#chart"></use>
    </svg>
`;
const recipeLoaderHTML = `
    <div class="recipe-details--loader">
        <img src="./images/Beep Beep Large Vehicle.svg" alt="illustration of a food truck">
        <span>Start searching for delicious recipes!</span>
    </div>
`;
let tempMealsList,
    tempRecipeDetails,
    bookmarksData = [];

const showError = (el, message) => {
    el.innerHTML = "";
    el.insertAdjacentHTML(
        "afterbegin",
        `<div class="error">
            <span>:( ${message}</span>
        </div>`
    );
};

const renderLoadState = (el, html) => {
    el.innerHTML = "";
    el.insertAdjacentHTML("afterbegin", html);
    el.classList.add("idle");
};

function convertFractionToDecimal(fraction) {
    if (!fraction.includes("/")) {
        // If the input is not a fraction (e.g., "3" without a fraction part)
        return parseFloat(fraction);
    }

    const parts = fraction.split(" ");
    const hasWholeNumberPart = parts.length === 2;

    if (hasWholeNumberPart) {
        const wholeNumberPart = parseInt(parts[0]);
        const [numerator, denominator] = parts[1].split("/").map(Number);
        const decimalFraction = numerator / denominator;
        return wholeNumberPart + decimalFraction;
    } else {
        const [numerator, denominator] = fraction.split("/").map(Number);
        return numerator / denominator;
    }
}

function convertDecimalToFraction(decimal) {
    const tolerance = 1.0e-6;
    let numerator, denominator, remainder;

    // Extract the whole number part and the fractional part
    const wholeNumberPart = Math.floor(decimal);
    const fractionalPart = decimal - wholeNumberPart;

    // If the fractional part is very close to 0 or 1, consider it as an integer
    if (
        Math.abs(fractionalPart) < tolerance ||
        Math.abs(fractionalPart - 1) < tolerance
    ) {
        return `${wholeNumberPart}`;
    }

    // Find the best rational approximation for the fractional part
    let bestApproximation = 0;
    for (let i = 1; i <= 1000; i++) {
        const numeratorCandidate = Math.round(fractionalPart * i);
        const error = Math.abs(fractionalPart - numeratorCandidate / i);
        if (error < tolerance) {
            bestApproximation = i;
            break;
        }
    }

    if (bestApproximation > 0) {
        numerator = Math.round(fractionalPart * bestApproximation);
        denominator = bestApproximation;
        remainder = wholeNumberPart > 0 ? wholeNumberPart : "";
        return `${remainder} ${numerator}/${denominator}`;
    } else {
        return decimal.toFixed(2); // Return the original decimal with 2 decimal places
    }
}

const changeServings = (value = 1) => {
    const servingsEl = document.querySelector(".recipe-servings--num");
    const oldValue = +servingsEl.innerText;
    const newValue = +servingsEl.innerText + 1 * value;
    newValue < 1
        ? (servingsEl.innerText = 1)
        : (servingsEl.innerText = newValue);

    // changing the quantity of recipe ingredients
    const ingredientsQuantity = [
        ...document.querySelectorAll(".ingredients--quantity"),
    ].filter((el) => {
        return el.innerText || false;
    });
    ingredientsQuantity.forEach((el) => {
        el.innerText = convertDecimalToFraction(
            (convertFractionToDecimal(el.innerText) / +oldValue) *
                +servingsEl.innerText
        );
    });
};

const renderBookmark = (obj) => {
    return `
        <a href="#${obj.id}">
            <div class="bookmark">
                <img src="${obj.image_url}" alt="meal image">
                <p class="bookmark-title">${obj.title}</p>
            </div>
        </a>
    `;
};

const renderBookmarksList = () => {
    bookmarksList.insertAdjacentHTML(
        "afterbegin",
        bookmarksData
            .map((obj) => {
                return renderBookmark(obj);
            })
            .reverse()
            .join("\n")
    );
};

// Changing grid-template-columns property of bookmarksList depending on no. of items & screen width
const setBookmarksGrid = () => {
    if (bookmarksData.length > 4) {
        bookmarksList.style.gridTemplateColumns =
            "repeat(auto-fit, minmax(20rem, 1fr))";
    } else if (bookmarksData.length > 3 && window.innerWidth < 1070) {
        bookmarksList.style.gridTemplateColumns =
            "repeat(auto-fit, minmax(20rem, 1fr))";
    } else if (bookmarksData.length > 2 && window.innerWidth < 700) {
        bookmarksList.style.gridTemplateColumns =
            "repeat(auto-fit, minmax(20rem, 1fr))";
    } else if (bookmarksData.length > 1 && window.innerWidth < 500) {
        bookmarksList.style.gridTemplateColumns =
            "repeat(auto-fit, minmax(20rem, 1fr))";
    } else {
        bookmarksList.style.gridTemplateColumns = "repeat(auto-fit, 20rem)";
    }
};

const renderRecipeDetails = () => {
    recipeDetailsContainer.innerHTML = "";
    const renderIngredients = (arr) => {
        return arr
            .map((obj) => {
                return `<li><span class="ingredients--quantity">${(function () {
                    return obj.quantity
                        ? convertDecimalToFraction(obj.quantity)
                        : "";
                })()}</span> ${obj.unit} ${obj.description}</li>`;
            })
            .join("\n");
    };

    const html = `
        <div class="recipe-container">
            <button id="bookmark-btn" type="button">
                <svg>
                    <use class="bookmark-normal" href="./images/icons.svg#bookmark"></use>
                    <use class="bookmark-fill" href="./images/icons.svg#bookmark-fill"></use>
                </svg>
            </button>

            <article class="info">
                <div class="recipe-img">
                    <img src="${
                        tempRecipeDetails.image_url
                    }" alt="recipe image">
                </div>

                <div class="info-grid">
                    <h1 class="recipe-name">${tempRecipeDetails.title}</h1>

                    <div class="recipe-time info-flex">
                        <svg>
                            <use href="./images/icons.svg#clock"></use>
                        </svg>
                        <span>${tempRecipeDetails.cooking_time} minutes</span>
                    </div>

                    <div class="recipe-servings info-flex">
                        <svg>
                            <use href="./images/icons.svg#profile-2user"></use>
                        </svg>

                        <p><span class="recipe-servings--num">${
                            tempRecipeDetails.servings
                        }</span> Servings</p>

                        <button id="decrease-btn" type="button" onclick="changeServings(-1);">
                            <svg>
                                <use href="./images/icons.svg#minus-square"></use>
                            </svg>
                        </button>

                        <button id="increase-btn" type="button" onclick="changeServings();">
                            <svg>
                                <use href="./images/icons.svg#add-square"></use>
                            </svg>
                        </button>
                    </div>
                </div>
            </article>

            <article class="ingredients">
                <h2>Ingredients</h2>
                <div class="block">
                    <ul class="ingredients-list">
                        ${renderIngredients(tempRecipeDetails.ingredients)}
                    </ul>
                </div>
            </article>

            <article class="reference">
                <h2>How to cook?</h2>
                <div>
                    <p>This recipe was carefully designed and tested by <span>${
                        tempRecipeDetails.publisher
                    }</span>. Please check out directions at their website.</p>
                    <a href="${tempRecipeDetails.source_url}" target="_blank">
                        <button id="reference-btn">
                            <span>Directions</span>
                            <svg>
                                <use href="./images/icons.svg#line-arrow-right"></use>
                            </svg>
                        </button>
                    </a>
                </div>
            </article>
        </div>
    `;

    recipeDetailsContainer.insertAdjacentHTML("afterbegin", html);

    const bookmarkBtn = document.getElementById("bookmark-btn");

    // checking whether the current recipe is bookmarked or not
    if (bookmarksData.find((obj) => obj.id === tempRecipeDetails.id))
        bookmarkBtn.classList.add("fill");

    // adding bookmark functionality
    bookmarkBtn.addEventListener("click", function () {
        if (this.classList.contains("fill")) {
            this.classList.remove("fill");

            bookmarksData = bookmarksData.filter(
                (obj) => obj.id !== tempRecipeDetails.id
            );

            bookmarksList.innerHTML = "";
            renderBookmarksList();

            setBookmarksGrid();
        } else {
            this.classList.add("fill");

            bookmarksList.insertAdjacentHTML(
                "afterbegin",
                `${renderBookmark(tempRecipeDetails)}`
            );

            bookmarksData.push({
                id: tempRecipeDetails.id,
                image_url: tempRecipeDetails.image_url,
                title: tempRecipeDetails.title,
            });

            setBookmarksGrid();
        }

        // saving to localStorage
        localStorage.setItem("bookmarksData", JSON.stringify(bookmarksData));
    });
};

const getRecipe = async (id) => {
    slider.classList.remove("active");
    renderLoadState(recipeDetailsContainer, recipeLoaderHTML);
    recipeDetailsContainer.classList.add("loader-active");
    try {
        const response = await fetch(
            `https://forkify-api.herokuapp.com/api/v2/recipes/${id}?key=${API_KEY}`
        );
        if (!response.ok) throw new Error("Recipe fetch failed!");

        const data = await response.json();

        recipeDetailsContainer.classList.remove("idle", "loader-active");
        tempRecipeDetails = data.data.recipe;
        renderRecipeDetails();
    } catch (err) {
        recipeDetailsContainer.classList.remove("loader-active");
        console.error(err.message);
        showError(recipeDetailsContainer, err.message);
    }
};

const renderMealsPage = (
    totalRecipes,
    recipesPerPage,
    currentPage,
    maxPages
) => {
    mealsListContainer.innerHTML = "";

    const previousPageBtn = `
        <button type="button" id="previous-page--btn" onclick="renderMealsPage(${totalRecipes}, ${recipesPerPage}, ${
        currentPage - 1
    }, ${maxPages});">
            <svg>
                <use href="./images/icons.svg#line-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
    `;
    const nextPageBtn = `
        <button type="button" id="next-page--btn" onclick="renderMealsPage(${totalRecipes}, ${recipesPerPage}, ${
        currentPage + 1
    }, ${maxPages});">
            <span>Page ${currentPage + 1}</span>
            <svg>
                <use href="./images/icons.svg#line-arrow-right"></use>
            </svg>
        </button>
    `;

    if (maxPages !== 1) {
        if (currentPage === 1) {
            mealsListContainer.insertAdjacentHTML(
                "beforeend",
                `
                <div class="btns-container">
                    ${nextPageBtn}
                </div>
            `
            );
        } else if (currentPage === maxPages) {
            mealsListContainer.insertAdjacentHTML(
                "beforeend",
                `
                <div class="btns-container">
                    ${previousPageBtn}
                </div>
            `
            );
        } else {
            mealsListContainer.insertAdjacentHTML(
                "beforeend",
                `
                <div class="btns-container">
                    ${previousPageBtn}
                    ${nextPageBtn}
                </div>
            `
            );
        }
    }

    for (
        let index = (currentPage - 1) * recipesPerPage;
        index < currentPage * recipesPerPage;
        index++
    ) {
        if (index + 1 > totalRecipes) break;

        const data = tempMealsList.data.recipes[index];
        mealsListContainer.insertAdjacentHTML(
            "afterbegin",
            `<a href="#${data.id}">
                <div class="meal">
                    <img src="${data.image_url}" alt="meal image">
                    <span class="title">${data.title}</span>
                </div>
            </a>`
        );
    }
};

const renderMealsList = () => {
    let recipesPerPage = 6;
    let totalRecipes;
    tempMealsList.results > 30
        ? (totalRecipes = 30)
        : (totalRecipes = tempMealsList.results);

    let currentPage = 1;
    let maxPages = Math.ceil(totalRecipes / recipesPerPage);

    renderMealsPage(totalRecipes, recipesPerPage, currentPage, maxPages);
};

const getMealsList = async (query) => {
    slider.classList.remove("active");
    if (document.querySelector(".recipe-details .error"))
        renderLoadState(recipeDetailsContainer, recipeLoaderHTML);
    renderLoadState(mealsListContainer, mealsLoaderHTML);
    mealsListContainer.classList.add("loader-active");

    try {
        const response = await fetch(
            `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}&key=${API_KEY}`
        );
        if (!response.ok) throw new Error("Meals List fetch failed!");

        const data = await response.json();
        if (data.results === 0) throw new Error("No results found!");

        mealsListContainer.classList.remove("idle", "loader-active");
        tempMealsList = data;
        renderMealsList();
    } catch (err) {
        mealsListContainer.classList.remove("loader-active");
        console.error(err.message);
        showError(mealsListContainer, err.message);
    }
};

addEventListener("load", () => {
    renderLoadState(mealsListContainer, mealsLoaderHTML);
    if (location.hash.slice(1) !== "") {
        getRecipe(location.hash.slice(1));
    } else {
        renderLoadState(recipeDetailsContainer, recipeLoaderHTML);
    }

    // loading bookmarks
    if (localStorage.getItem("bookmarksData")) {
        bookmarksData = JSON.parse(localStorage.getItem("bookmarksData"));
        renderBookmarksList();
        setBookmarksGrid();
    }
});

addEventListener("hashchange", () => {
    if (location.hash.slice(1) !== "") {
        getRecipe(location.hash.slice(1));
    }
});

searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getMealsList(searchBar.value);
    }
});

logo.addEventListener("click", () => {
    slider.classList.remove("active");
});

showBookmarksBtn.addEventListener("click", () => {
    slider.classList.add("active");
    location.hash = "";
});
