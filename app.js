let userScore = 0;
let compScore = 0;
let bestOf = 0; // 0 = normal mode
let roundCount = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");
const resetBtn = document.querySelector("#reset-btn");
const bestOfBtn = document.querySelector("#bestof-btn");
const historyList = document.querySelector("#history-list");
const themeToggle = document.querySelector("#theme-toggle");

// Theme order: purple → blue → black → green → red
const themes = ["theme-purple", "theme-blue", "theme-black", "theme-green", "theme-red"];
let currentTheme = 0;

// Generate computer choice
const genCompChoice = () => {
  const options = ["rock", "paper", "scissors"];
  const randIdx = Math.floor(Math.random() * 3);
  return options[randIdx];
};

// Update message with animation
const updateMsg = (text, status) => {
  msg.innerText = text;
  msg.className = "";
  if (status) msg.classList.add(status);
};

// Add history entry
const addHistory = (user, comp, result) => {
  const li = document.createElement("li");
  li.textContent = `You: ${user} | Computer: ${comp} → ${result}`;
  historyList.prepend(li);
};

// Show winner
const showWinner = (userWin, userChoice, compChoice) => {
  if (userWin) {
    userScore++;
    userScorePara.innerText = userScore;
    updateMsg(`You win! ${userChoice} beats ${compChoice}`, "win");
    addHistory(userChoice, compChoice, "✅ Win");
  } else {
    compScore++;
    compScorePara.innerText = compScore;
    updateMsg(`You lost! ${compChoice} beats ${userChoice}`, "lose");
    addHistory(userChoice, compChoice, "❌ Lose");
  }
};

// Handle draw
const drawGame = (choice) => {
  updateMsg(`It's a draw! You both choose ${choice}`, "draw");
  addHistory(choice, choice, "➖ Draw");
};

// Play game
const playGame = (userChoice) => {
  const compChoice = genCompChoice();

  if (userChoice === compChoice) {
    drawGame(userChoice);
  } else {
    let userWin = true;
    if (userChoice === "rock") {
      userWin = compChoice !== "paper";
    } else if (userChoice === "paper") {
      userWin = compChoice !== "scissors";
    } else {
      userWin = compChoice !== "rock";
    }
    showWinner(userWin, userChoice, compChoice);
  }

  // Best of N mode check
  if (bestOf > 0) {
    roundCount++;
    if (roundCount >= bestOf) {
      if (userScore > compScore) {
        updateMsg(`🎉 You won Best of ${bestOf}!`, "win");
      } else if (compScore > userScore) {
        updateMsg(`💻 Computer won Best of ${bestOf}!`, "lose");
      } else {
        updateMsg(`🤝 It's a tie in Best of ${bestOf}!`, "draw");
      }
      disableChoices();
    }
  }
};

// Disable choices after game end
const disableChoices = () => {
  choices.forEach((c) => (c.style.pointerEvents = "none"));
};

// Enable choices again
const enableChoices = () => {
  choices.forEach((c) => (c.style.pointerEvents = "auto"));
};

// Reset game
const resetGame = () => {
  userScore = 0;
  compScore = 0;
  roundCount = 0;
  userScorePara.innerText = 0;
  compScorePara.innerText = 0;
  historyList.innerHTML = "";
  updateMsg("Play your move", "");
  enableChoices();
};

// Toggle Best of 5
bestOfBtn.addEventListener("click", () => {
  bestOf = bestOf === 5 ? 0 : 5;
  bestOfBtn.innerText = bestOf ? "🎯 Best of 5 Active" : "🏆 Best of 5";
  resetGame();
});

// Reset button
resetBtn.addEventListener("click", resetGame);

// Theme cycle
themeToggle.addEventListener("click", () => {
  document.body.classList.remove(themes[currentTheme]);
  currentTheme = (currentTheme + 1) % themes.length;
  document.body.classList.add(themes[currentTheme]);
});

// User choice clicks
choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const userChoice = choice.getAttribute("id");
    playGame(userChoice);
  });
});

// ===== Scroll Reveal Animation =====
const reveals = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;

  reveals.forEach((el) => {
    const boxTop = el.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      el.classList.add("active");
    }
  });
};

