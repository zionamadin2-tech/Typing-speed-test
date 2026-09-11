export function renderText(passage) {
  const text = document.querySelector(".test-status-text");
  text.innerHTML = "";
  //This changes every string in an array into individual parts and then assigning span to every parts then it appends the span into a child in text
  passage.split("").forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    text.appendChild(span);
  });
}
