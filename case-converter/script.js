let textArea = document.getElementById("textArea");


document.getElementById("upper-case").addEventListener("click", function () {
  textArea.value = textArea.value.toUpperCase();
});

document.getElementById("lower-case").addEventListener("click", function () {
  textArea.value = textArea.value.toLowerCase();
});


document.getElementById("proper-case").addEventListener("click", function () {
  textArea.value = textArea.value.toLowerCase();
  // Splitting words
  let array = textArea.value.split(" ");
  for (let i = 0; i < array.length; i++) {
    // Converting words to character and changing the first character to upperCase
    let charArray = array[i].split("");
    charArray[0] = charArray[0].toUpperCase();
    // Joining characters
    array[i] = charArray.join("");
  }
  // Joining words
  textArea.value = array.join(" ");
});


document.getElementById("sentence-case").addEventListener("click", function () {
  textArea.value = textArea.value.toLowerCase();
  // Splitting sentences
  let array = textArea.value.split(". ");
  for (let i = 0; i < array.length; i++) {
    // Splitting words
    let arrayTwo = array[i].split(" ");
    // Converting words to character and changing the first character of the first word to upperCase
    let charArray = arrayTwo[0].split("");
    charArray[0] = charArray[0].toUpperCase();
    // Joining characters
    arrayTwo[0] = charArray.join("");
    // Joining words
    array[i] = arrayTwo.join(" ");
  }
  // Joining sentences
  textArea.value = array.join(". ");
});


function download(filename, text) {
  let element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


document.getElementById("save-text-file").addEventListener("click", function () {
    // Start file download.
    download("text.txt", textArea.value);
});
