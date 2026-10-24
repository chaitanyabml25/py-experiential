
const TOTAL_ROUNDS = 25;

let playerWins = 0;
let computerWins = 0;
let ties = 0;

let currentRound = 0;
let currentStreak = 0;
let longestStreak = 0;

const choices = ["Rock", "Paper", "Scissors"];

const buttons = document.querySelectorAll(".choice");
const restartBtn = document.getElementById("restartBtn");

// Computer randomly selects a choice
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Decide the winner
function getWinner(player, computer) {

    if (player === computer) {
        return "Tie";
    }

    if (
        (player === "Rock" && computer === "Scissors") ||
        (player === "Paper" && computer === "Rock") ||
        (player === "Scissors" && computer === "Paper")
    ) {
        return "Player";
    }

    return "Computer";
}

// Play one round
function playGame(playerChoice) {

    if (currentRound >= TOTAL_ROUNDS) {
        return;
    }

    const computerChoice = getComputerChoice();
    const winner = getWinner(playerChoice, computerChoice);

    currentRound++;

    if (winner === "Player") {
        playerWins++;
        currentStreak++;

        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }

    } else if (winner === "Computer") {
        computerWins++;
        currentStreak = 0;

    } else {
        ties++;
        currentStreak = 0;
    }

    document.getElementById("playerChoice").textContent =
        "Your choice: " + playerChoice;

    document.getElementById("computerChoice").textContent =
        "Computer choice: " + computerChoice;

    const resultText = document.getElementById("resultText");

    if (winner === "Player") {
        resultText.textContent = "🎉 You Win!";
    } else if (winner === "Computer") {
        resultText.textContent = "💻 Computer Wins!";
    } else {
        resultText.textContent = "🤝 It's a Tie!";
    }

    document.getElementById("roundInfo").textContent =
        `Round ${currentRound} / ${TOTAL_ROUNDS}`;

    addHistory(playerChoice, computerChoice, winner);

    updateDashboard();

    if (currentRound === TOTAL_ROUNDS) {
        resultText.textContent =
            `🏆 Game Over! Player: ${playerWins} | Computer: ${computerWins} | Ties: ${ties}`;

        buttons.forEach(button => {
            button.disabled = true;
        });
    }
}

// Add round information to the history table
function addHistory(player, computer, winner) {

    const historyBody = document.getElementById("historyBody");

    if (currentRound === 1) {
        historyBody.innerHTML = "";
    }

    const row = document.createElement("tr");

    const values = [
        currentRound,
        player,
        computer,
        winner
    ];

    values.forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    historyBody.prepend(row);
}

// Update all dashboard statistics
function updateDashboard() {

    const total = playerWins + computerWins + ties;

    const winRate = total > 0
        ? ((playerWins / total) * 100).toFixed(1)
        : 0;

    document.getElementById("playerWins").textContent = playerWins;
    document.getElementById("computerWins").textContent = computerWins;
    document.getElementById("ties").textContent = ties;

    document.getElementById("roundsLeft").textContent =
        TOTAL_ROUNDS - currentRound;

    document.getElementById("winRate").textContent =
        winRate + "%";

    document.getElementById("longestStreak").textContent =
        longestStreak;

    document.getElementById("totalRounds").textContent =
        currentRound;

    updateCharts();
}

// Update bar chart and pie chart
function updateCharts() {

    const total = currentRound || 1;

    const playerPercentage = (playerWins / total) * 100;
    const computerPercentage = (computerWins / total) * 100;
    const tiesPercentage = (ties / total) * 100;

    document.getElementById("playerBar").style.width =
        playerPercentage + "%";

    document.getElementById("computerBar").style.width =
        computerPercentage + "%";

    document.getElementById("tiesBar").style.width =
        tiesPercentage + "%";

    document.getElementById("playerBarValue").textContent =
        playerWins;

    document.getElementById("computerBarValue").textContent =
        computerWins;

    document.getElementById("tiesBarValue").textContent =
        ties;

    const playerEnd = playerPercentage;
    const computerEnd = playerEnd + computerPercentage;

    document.getElementById("pieChart").style.background =
        `conic-gradient(
            #28c76f 0% ${playerEnd}%,
            #ea5455 ${playerEnd}% ${computerEnd}%,
            #ffca28 ${computerEnd}% 100%
        )`;
}

// Restart the complete game
function restartGame() {

    playerWins = 0;
    computerWins = 0;
    ties = 0;

    currentRound = 0;
    currentStreak = 0;
    longestStreak = 0;

    document.getElementById("playerChoice").textContent =
        "Your choice: -";

    document.getElementById("computerChoice").textContent =
        "Computer choice: -";

    document.getElementById("resultText").textContent =
        "Let's Play!";

    document.getElementById("roundInfo").textContent =
        "Round 0 / 25";

    document.getElementById("historyBody").innerHTML =
        '<tr><td colspan="4">No games played yet.</td></tr>';

    buttons.forEach(button => {
        button.disabled = false;
    });

    updateDashboard();
}

// Connect buttons to game logic
buttons.forEach(button => {
    button.addEventListener("click", () => {
        playGame(button.dataset.choice);
    });
});

// Connect restart button
restartBtn.addEventListener("click", restartGame);

// Initialize dashboard
updateDashboard();
