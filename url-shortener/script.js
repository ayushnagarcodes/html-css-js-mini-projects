let input = document.getElementById("input-url");
let createBtn = document.getElementById("button-create");
let deleteBtn = document.getElementById("button-delete");
let list = document.getElementById("list-url");

let error = document.createElement("p");
error.textContent = "Please enter a valid url";
error.className = "error";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let regex = /https?:\/\/.+\..+/;
let tempLink = null;
let canEdit = true;

function randomChar() {
    let string = "";
    for (let i = 0; i < 5; i++) {
        string += chars[Math.floor(Math.random() * chars.length)];
    }
    return string;
}

function incrementClick(obj) {
    let countElement = obj.parentElement.children.item(1);
    let count = countElement.textContent.slice(8);
    count = Number(count) + 1;
    countElement.textContent = "Clicks: " + count;
}

function editLink(obj) {
    if (obj.textContent === "Edit" && canEdit) {
        canEdit = false;
        let linkElem = obj.parentElement.firstElementChild;
        tempLink = linkElem.href;
        let input = document.createElement("input");
        input.type = "text";
        input.value = linkElem.textContent.slice(10);
        linkElem.replaceWith(input);
        obj.textContent = "Save";
    } else if (obj.textContent === "Save") {
        canEdit = true;
        let input = obj.parentElement.firstElementChild;
        let linkElem = `<a href=${tempLink} target="_blank" onclick="incrementClick(this)">localhost/${input.value}</a>`;
        input.remove();
        obj.parentElement.insertAdjacentHTML("afterbegin", linkElem);
        obj.textContent = "Edit";
    }
}

input.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
        createBtn.click();
    }
});

createBtn.addEventListener("click", () => {
    if (regex.test(input.value)) {
        let link = input.value;
        list.insertAdjacentHTML(
            "beforeend",
            `<li>
                    <a href=${link} target="_blank" onclick="incrementClick(this)">localhost/${randomChar()}</a>
                     - ${link} - 
                    <span>Clicks: 0</span>
                    <button onclick="editLink(this)">Edit</button>
                 </li>`
        );

        // removing the error if it exists in the DOM
        if (document.querySelector(".error")) {
            document.querySelector(".error").remove();
        }
    } else {
        document.querySelector("main > section").appendChild(error);
    }
});

deleteBtn.addEventListener("click", () => {
    // console.log("hey")
    if (input.value === "") {
        document.querySelectorAll("#list-url > li").forEach((elem) => {
            elem.remove();
            return 0;
        });
    }

    // matching with regexp because if I enter "https://google.com", a.href will be equal to "https://google.com/" and it won't be removed
    // also to remove a URL, whether user adds "/" or not at the end of the link
    let regex2;
    if (input.value.endsWith("/")) {
        regex2 = new RegExp(`^${input.value}?$`, "i");
    } else {
        regex2 = new RegExp(`^${input.value}/?$`, "i");
    }
    document.querySelectorAll("#list-url > li > a").forEach((elem) => {
        if (input.value === elem.textContent || regex2.test(elem.href)) {
            elem.parentElement.remove();
        }
    });
});
