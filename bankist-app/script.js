"use strict";

/////////////////////////////////////////////////
// Data
const account1 = {
    username: "an",
    owner: "Ayush Nagar",
    movements: [
        [200, "2019-11-18T21:31:17.178Z"],
        [450, "2019-12-23T07:42:02.383Z"],
        [-400, "2020-01-28T09:15:04.904Z"],
        [3000, "2020-04-01T10:17:24.185Z"],
        [-650, "2020-05-08T14:11:59.604Z"],
        [-130, "2020-07-26T17:01:17.194Z"],
        [70, "2020-07-28T23:36:17.929Z"],
        [1300, "2020-08-01T10:51:36.790Z"],
    ],
    interestRate: 1.2, // %
    pin: 1111,
    currency: "INR",
    loan: 0,
    locale: "en-IN",
};

const account2 = {
    username: "jd",
    owner: "Jessica Davis",
    movements: [
        [5000, "2019-11-01T13:15:33.035Z"],
        [3400, "2019-11-30T09:48:16.867Z"],
        [-150, "2019-12-25T06:04:23.907Z"],
        [-790, "2020-01-25T14:18:46.235Z"],
        [-3210, "2020-02-05T16:33:06.386Z"],
        [-1000, "2020-04-10T14:43:26.374Z"],
        [8500, "2020-06-25T18:49:59.371Z"],
        [-30, "2020-07-26T12:01:20.894Z"],
    ],
    interestRate: 1.5,
    pin: 2222,
    currency: "USD",
    loan: 0,
    locale: "en-US",
};

const account3 = {
    username: "stw",
    owner: "Steven Thomas Williams",
    movements: [
        [200, "2019-11-01T13:15:33.035Z"],
        [-200, "2019-11-30T09:48:16.867Z"],
        [340, "2019-12-25T06:04:23.907Z"],
        [-300, "2020-01-25T14:18:46.235Z"],
        [-20, "2020-02-05T16:33:06.386Z"],
        [50, "2020-04-10T14:43:26.374Z"],
        [400, "2020-06-25T18:49:59.371Z"],
        [-460, "2020-07-26T12:01:20.894Z"],
    ],
    interestRate: 0.7,
    pin: 3333,
    currency: "GBP",
    loan: 0,
    locale: "en-GB",
};

const accounts = [account1, account2, account3];
let currentLoggedAccount = undefined;
let currentDate = new Date();
let isMovementsSorted = false;
let timerInterval = undefined;

/////////////////////////////////////////////////
// Elements
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const containerInfo = document.querySelector(".info");

const labelGreet = document.querySelector(".greet");
const labelDate = document.querySelector(".balance__date");
const labelBalance = document.querySelector(".balance__amount");
const labelSumIn = document.querySelector(".summary__amount--in");
const labelSumOut = document.querySelector(".summary__amount--out");
const labelSumInterest = document.querySelector(".summary__amount--interest");
const labelTimer = document.querySelector(".timer");

const formLogin = document.querySelector(".login");
const formTransactTransfer = document.querySelector(
    ".transact__transfer--form"
);
const formTransactRequest = document.querySelector(".transact__request--form");
const formTransactClose = document.querySelector(".transact__close--form");

const inputLoginUsername = document.getElementById("login__input--user");
const inputLoginPin = document.getElementById("login__input--pin");
const inputTransferTo = document.getElementById("transact__transfer--to");
const inputTransferAmount = document.getElementById(
    "transact__transfer--amount"
);
const inputLoanAmount = document.getElementById("transact__request--amount");
const inputCloseUsername = document.getElementById("transact__close--user");
const inputClosePin = document.getElementById("transact__close--pin");

const btnSort = document.getElementById("summary__sort--btn");

/////////////////////////////////////////////////
// Functions
const getFormattedDate = (date, locale) => {
    const options = {
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric",
    };
    return new Intl.DateTimeFormat(locale, options).format(date);
};

const modifyDate = (date, presentDate, locale) => {
    const daysPassed = Math.floor(
        Math.abs(presentDate - date) / (1000 * 60 * 60 * 24)
    );
    const value =
        daysPassed === 0
            ? "TODAY"
            : daysPassed === 1
            ? "YESTERDAY"
            : getFormattedDate(date, locale);
    return value;
};

const checkAmountFormat = (amount, locale, currency) => {
    const options = {
        style: "currency",
        currency: `${currency}`,
    };
    return new Intl.NumberFormat(locale, options).format(amount);
};

const startTimer = () => {
    let minutes = 2;
    let seconds = 0;

    const displayTimer = (minutes, seconds) => {
        return `${String(minutes).padStart(2, 0)}:${String(seconds).padStart(
            2,
            0
        )}`;
    };

    labelTimer.innerText = displayTimer(minutes, seconds);

    timerInterval = setInterval(() => {
        seconds--;
        if (minutes === 0 && seconds === 0) {
            clearInterval(timerInterval);
            location.reload();
        } else if (seconds < 0) {
            seconds = 59;
            minutes -= 1;
        }
        labelTimer.innerText = displayTimer(minutes, seconds);
    }, 1000);
};

const loadApp = (accountObj) => {
    isMovementsSorted = false;
    let sumIn = 0;
    let sumOut = 0;

    // loading balance section
    labelGreet.innerText = `Good Afternoon, ${accountObj.owner.split(" ")[0]}!`;
    labelDate.innerText =
        "As of " + getFormattedDate(currentDate, accountObj.locale);
    accountObj.balance = accountObj.movements
        .map((arr) => {
            return arr[0];
        })
        .reduce((sum, amount) => {
            return (sum += amount);
        });

    labelBalance.innerText = checkAmountFormat(
        accountObj.balance,
        accountObj.locale,
        accountObj.currency
    );

    // loading movements section
    containerMovements.replaceChildren();
    accountObj.movements.forEach((arr, index) => {
        const movementsType = arr[0] > 0 ? "deposit" : "withdrawal";

        containerMovements.insertAdjacentHTML(
            "afterbegin",
            `<div class="movements__row">
                <div class="movements__label movements__label--${movementsType}">
                    <span>${index + 1} ${movementsType.toUpperCase()}</span>
                </div>
                <span class="movements__date">${modifyDate(
                    new Date(arr[1]),
                    currentDate,
                    accountObj.locale
                )}</span>
                <p class="movements__amount">${checkAmountFormat(
                    arr[0],
                    accountObj.locale,
                    accountObj.currency
                )}</p>
            </div>`
        );

        arr[0] > 0 ? (sumIn += arr[0]) : (sumOut += arr[0] * -1);
    });

    // loading summary section
    labelSumIn.innerText = checkAmountFormat(
        sumIn,
        accountObj.locale,
        accountObj.currency
    );
    labelSumOut.innerText = checkAmountFormat(
        sumOut,
        accountObj.locale,
        accountObj.currency
    );
    const sumInterest = (accountObj.loan * accountObj.interestRate) / 100;
    labelSumInterest.innerText = checkAmountFormat(
        sumInterest,
        accountObj.locale,
        accountObj.currency
    );
};

const login = (e) => {
    const account = accounts.find(
        (acc) =>
            acc.username === inputLoginUsername.value &&
            acc.pin === Number(inputLoginPin.value)
    );
    if (account) {
        containerApp.style.opacity = "1";
        containerInfo.style.visibility = "hidden";
        containerInfo.style.opacity = "0";
        e.target.reset();
        currentLoggedAccount = account;
        loadApp(account);

        // Reset timer
        clearInterval(timerInterval);
        startTimer();
    }
    e.preventDefault();
};

const transferMoney = (e) => {
    if (
        currentLoggedAccount.username !== inputTransferTo.value &&
        inputTransferAmount.valueAsNumber > 0 &&
        currentLoggedAccount.balance >= inputTransferAmount.valueAsNumber
    ) {
        const account = accounts.find(
            (acc) => acc.username === inputTransferTo.value
        );
        if (account) {
            currentLoggedAccount.movements.push([
                inputTransferAmount.valueAsNumber * -1,
                currentDate.toISOString(),
            ]);
            account.movements.push([
                inputTransferAmount.valueAsNumber,
                currentDate.toISOString(),
            ]);
            loadApp(currentLoggedAccount);
            e.target.reset();
        }
    }

    // Reset timer
    clearInterval(timerInterval);
    startTimer();
    e.preventDefault();
};

const requestLoan = (e) => {
    if (inputLoanAmount.valueAsNumber > 0) {
        currentLoggedAccount.movements.push([
            inputLoanAmount.valueAsNumber,
            currentDate.toISOString(),
        ]);
        currentLoggedAccount.loan += inputLoanAmount.valueAsNumber;
        loadApp(currentLoggedAccount);
        e.target.reset();
    }

    // Reset timer
    clearInterval(timerInterval);
    startTimer();
    e.preventDefault();
};

const closeAccount = (e) => {
    if (
        currentLoggedAccount.username === inputCloseUsername.value &&
        currentLoggedAccount.pin === Number(inputClosePin.value)
    ) {
        accounts.splice(accounts.indexOf(currentLoggedAccount), 1);
        containerApp.style.opacity = "0";
        containerInfo.style.visibility = "visible";
        containerInfo.style.opacity = "1";
        e.target.reset();
    }
    e.preventDefault();
};

const sort = () => {
    // if movements is sorted and then the sort button is pressed, then removing the sort
    if (isMovementsSorted) {
        loadApp(currentLoggedAccount);
        // changing explicitly, because we are changing isMovementsSorted in loadApp also
        isMovementsSorted = false;
    }
    // if movements is not sorted and then the sort button is pressed, then applying the sort
    else {
        // creating a copy of the original array so that it doesn't change after sorting
        // could've also used -> currentLoggedAccount.slice().sort()
        const temp = [...currentLoggedAccount.movements];
        // sorting movements in descending order according to the amount
        const sortedMovements = temp.sort((firstEle, secondEle) => {
            return secondEle[0] - firstEle[0];
        });

        // updating movements container
        containerMovements.replaceChildren();
        sortedMovements.forEach((arr, index) => {
            const movementsType = arr[0] > 0 ? "deposit" : "withdrawal";

            containerMovements.insertAdjacentHTML(
                "beforeend",
                `<div class="movements__row">
                    <div class="movements__label movements__label--${movementsType}">
                        <span>${
                            sortedMovements.length - index
                        } ${movementsType.toUpperCase()}</span>
                    </div>
                    <span class="movements__date">${modifyDate(
                        new Date(arr[1]),
                        currentDate,
                        currentLoggedAccount.locale
                    )}</span>
                    <p class="movements__amount">${checkAmountFormat(
                        arr[0],
                        currentLoggedAccount.locale,
                        currentLoggedAccount.currency
                    )}</p>
                </div>`
            );
        });
        isMovementsSorted = !isMovementsSorted;
    }
};

/////////////////////////////////////////////////
// Event Listeners
formLogin.addEventListener("submit", login);
formTransactTransfer.addEventListener("submit", transferMoney);
formTransactRequest.addEventListener("submit", requestLoan);
formTransactClose.addEventListener("submit", closeAccount);
btnSort.addEventListener("click", sort);
