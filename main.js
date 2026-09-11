import { getRandomText } from "./test.js";
import { renderText } from "./render.js";

// ---------- Element references ----------
const startButton = document.querySelector(".starting-test button");
const startingTest = document.querySelector(".starting-test");
const text = document.querySelector(".test-status-text");
const restartSection = document.querySelector(".footer");
const difficultyButtons = document.querySelectorAll(".pill-group .pill-1");
const passageButton = document.querySelector(".passage");
const hiddenInput = document.querySelector(".hidden-input");
const timerButton = document.querySelector(".Timer");
const arrowDown = document.querySelectorAll(".arrow-down");

const activeWpmDisplay = document.querySelector(".active-wpm");
const activeAccuracyDisplay = document.querySelector(".active-accuracy");
const activeTimeDisplay = document.querySelector(".active-time");

const screenNotStarted = document.querySelector(".screen--not-started");
const screenResults = document.querySelector(".screen-results");
const wpmScoreDisplay = document.querySelector(".wpm-1-score");
const accuracyScoreDisplay = document.querySelector(".accuracy-1-score");
const charactersScoreDisplay = document.querySelector(".characters-score");
const bestScoreDisplay = document.querySelectorAll(".speed"); // FIXED: querySelectorAll
const resultsTitle = document.querySelector(".test-complete");
const resultsSubtitle = document.querySelector(".test-comment");
const resultsIcon = document.querySelector(".test-accomplished img");
const goAgainText = document.querySelector(".go-again-but p");

function updateResultsCopy({ isFirstTest, isNewBest }) {
  if (isFirstTest) {
    resultsTitle.textContent = "Baseline Established!";
    resultsSubtitle.textContent =
      "You've set the bar. Now the real challenge begins—time to beat it.";
    resultsIcon.src = "icon-completed.svg";
    goAgainText.textContent = "Beat This Score";
  } else if (isNewBest) {
    resultsTitle.textContent = "High Score Smashed!";
    resultsSubtitle.textContent =
      "You're getting faster. That was incredible typing.";
    resultsIcon.src = "icon-new-pb.svg";
    goAgainText.textContent = "Go Again";
    celebrate();
  } else {
    resultsTitle.textContent = "Test Complete!";
    resultsSubtitle.textContent =
      "Solid run. Keep pushing to beat your high score.";
    resultsIcon.src = "pattern-confetti.svg";
    goAgainText.textContent = "Go Again";
  }
}
function celebrate() {
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 70,
    origin: { x: 0, y: 0.6 },
  });
  confetti({
    particleCount: 80,
    angle: 120,
    spread: 70,
    origin: { x: 1, y: 0.6 },
  });
}
// ---------- State ----------
let currentDifficulty = "hard";
let timeLeft = 60;
let timerInterval = null;
let testStarted = false;
let isPassage = false;
let correctChars = 0;
let incorrectChars = 0;

// ---------- Best score (must be set up BEFORE any listeners that could call endTest) ----------
function loadBestScore() {
  const savedBest = localStorage.getItem("typing-best-wpm");
  const best = savedBest ? Number(savedBest) : 0;
  bestScoreDisplay.forEach((el) => (el.textContent = `${best} WPM`));
  return best;
}

let bestWpm = loadBestScore(); // now runs immediately at load, before any event can fire

// ---------- Initial render ----------
renderText(getRandomText(currentDifficulty));
text.querySelector("span")?.classList.add("current");

// ---------- Start test ----------
startButton.addEventListener("click", () => {
  startingTest.classList.add("hide");
  text.classList.add("show-text");
  restartSection.classList.remove("hide");
  hiddenInput.focus();
});

// ---------- Click text to refocus keyboard ----------
text.addEventListener("click", () => {
  startingTest.classList.add("hide");
  text.classList.add("show-text");
  restartSection.classList.remove("hide");
  hiddenInput.focus();
});
// -------Mobile Screen Status Section ------
arrowDown.forEach((arrow) => {
  arrow.addEventListener("click", (e) => {
    // Target only the dropdown belonging to the clicked arrow
    const container = e.target.closest(".difficulty, .timed");
    const dropdown = container.querySelector(".mobile-difficulty-section");

    // Toggle class based on current state
    dropdown.classList.toggle("clip-path-on");
  });
});
// ---------- Mobile dropdown: difficulty selection ----------
const difficultyRadios = document.querySelectorAll(
  'input[name="difficulty-radio"]',
);

difficultyRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    currentDifficulty = radio.dataset.difficulty;
    renderText(getRandomText(currentDifficulty));
    resetTest();

    // Update the visible button label
    const label =
      currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
    document.querySelector(".difficulty .arrow-down").firstChild.textContent =
      label;

    // Close the dropdown
    radio
      .closest(".mobile-difficulty-section")
      .classList.remove("clip-path-on");
  });
});

// ---------- Mobile dropdown: mode selection (Timed / Passage) ----------
const modeRadios = document.querySelectorAll('input[name="test-type"]');

modeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    const mode = radio.dataset.mode;

    if (mode === "passage") {
      clearInterval(timerInterval);
      isPassage = true;
      passageUpdates();
    } else {
      isPassage = false;
      startTimer();
    }

    // Update the visible button label
    const label = mode === "passage" ? "Passage" : "Timed(60s)";
    document.querySelector(".timed .arrow-down").firstChild.textContent = label;

    // Close the dropdown
    radio
      .closest(".mobile-difficulty-section")
      .classList.remove("clip-path-on");
  });
});
// ---------- Difficulty selection ----------
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentDifficulty = button.dataset.difficulty;
    renderText(getRandomText(currentDifficulty));

    resetTest();
  });
});

// ---------- Typing logic ----------
const spans = () => text.querySelectorAll("span");

hiddenInput.addEventListener("input", () => {
  if (!testStarted && !isPassage) {
    testStarted = true;
    startTimer();
  }

  const typedText = hiddenInput.value;
  const allSpans = spans();

  correctChars = 0;
  incorrectChars = 0;

  allSpans.forEach((span, index) => {
    const typedChar = typedText[index];

    if (typedChar == null) {
      span.className = "";
    } else if (typedChar === span.textContent) {
      span.className = "correct";
      correctChars++;
    } else {
      span.className = "incorrect";
      incorrectChars++;
    }
  });

  if (allSpans[typedText.length]) {
    allSpans[typedText.length].classList.add("current");
  }

  updateStats();

  if (typedText.length >= allSpans.length) {
    endTest();
  }
});

// ---------- Timer ----------
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    activeTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}
// ---------- Passage / Timed mode buttons (top-level — attached ONCE) ----------
passageButton.addEventListener("click", () => {
  clearInterval(timerInterval); // was: clearTimeout — wrong function for an interval, fixed below too
  isPassage = true;
  passageUpdates();
});

timerButton.addEventListener("click", () => {
  isPassage = false;
  updateStats();
  if (testStarted) {
    startTimer();
  }
});
// ---------- Live stats ----------
function updateStats() {
  const totalTyped = correctChars + incorrectChars;
  let accuracy =
    totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);

  const secondsElapsed = 60 - timeLeft;
  const minutesElapsed = secondsElapsed / 60;
  let wpm =
    minutesElapsed === 0 ? 0 : Math.round(correctChars / 5 / minutesElapsed);
  activeWpmDisplay.textContent = wpm;
  activeAccuracyDisplay.textContent = `${accuracy}%`;
  passageUpdates();
}

// ----------Passage Updates -------
function passageUpdates() {
  // --This makes every calculation stops--
  if (isPassage === true) {
    let wpm = 0;
    let accuracy = 0;
    activeTimeDisplay.textContent = "Passage";
    activeWpmDisplay.textContent = "-";
    activeAccuracyDisplay.textContent = "-";
    wpmScoreDisplay.textContent = "-";
    accuracyScoreDisplay.textContent = "-";
  }
}

// ---------- Reset for a new test ----------
function endTest() {
  clearInterval(timerInterval);
  hiddenInput.blur();

  const totalTyped = correctChars + incorrectChars;
  const accuracy =
    totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);
  const finalWpm = Number(activeWpmDisplay.textContent);

  wpmScoreDisplay.textContent = finalWpm;
  accuracyScoreDisplay.textContent = `${accuracy}%`;
  charactersScoreDisplay.textContent = `${correctChars}/${incorrectChars}`;
  passageUpdates();

  const isFirstTest = localStorage.getItem("typing-has-played") == null;
  const isNewBest = finalWpm > bestWpm;

  if (isNewBest) {
    bestWpm = finalWpm;
    localStorage.setItem("typing-best-wpm", bestWpm);
    bestScoreDisplay.forEach((el) => (el.textContent = `${bestWpm} WPM`));
  }

  localStorage.setItem("typing-has-played", "true");

  updateResultsCopy({ isFirstTest, isNewBest });

  screenNotStarted.classList.add("hide");
  screenResults.classList.remove("hide");
}

// ---------- Reset for a new test ----------
function resetTest() {
  clearInterval(timerInterval);
  timeLeft = 60;
  testStarted = false;
  correctChars = 0;
  incorrectChars = 0;

  activeTimeDisplay.textContent = "0:60";
  activeWpmDisplay.textContent = "0";
  activeAccuracyDisplay.textContent = "100%";

  hiddenInput.value = "";
  text.querySelector("span")?.classList.add("current");
  startingTest.classList.remove("hide");
  text.classList.remove("show-text");
  restartSection.classList.add("hide");
  screenResults.classList.add("hide");
  screenNotStarted.classList.remove("hide");
}

// ---------- Restart button (on results screen and footer) ----------
document.querySelectorAll(".restart-button, .go-again-but").forEach((btn) => {
  btn.addEventListener("click", () => {
    renderText(getRandomText(currentDifficulty));
    resetTest();
  });
});
