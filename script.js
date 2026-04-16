const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const board = document.getElementById("board");
let cells = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

function createBoard() {
  board.innerHTML = "";
  cells.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.innerText = val;
    cell.addEventListener("click", () => playerMove(i));
    board.appendChild(cell);
  });
}

function playerMove(index) {
  if (cells[index] !== "" || gameOver) return;
  clickSound.play();
  cells[index] = "X";
  createBoard();

  if (checkWinner(cells, "X")) {
    alert("You Win!");
    winSound.play();
    gameOver = true;
    return;
  }

  if (isDraw()) {
    alert("Draw!");
    gameOver = true;
    return;
  }

  computerMove();
}

function computerMove() {
  let bestScore = -Infinity;
  let move;
  clickSound.play();
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === "") {
      cells[i] = "O";
      let score = minimax(cells, 0, false);
      cells[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  cells[move] = "O";
  createBoard();

  if (checkWinner(cells, "O")) {
    alert("Computer Wins!");
    loseSound.play();
    gameOver = true;
  } else if (isDraw()) {
    alert("Draw!");
    gameOver = true;
  }
}

function minimax(boardState, depth, isMaximizing) {
  if (checkWinner(boardState, "O")) return 10 - depth;
  if (checkWinner(boardState, "X")) return depth - 10;
  if (boardState.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "O";
        let score = minimax(boardState, depth + 1, false);
        boardState[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] === "") {
        boardState[i] = "X";
        let score = minimax(boardState, depth + 1, true);
        boardState[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(boardState, player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  return winPatterns.some(pattern =>
    pattern.every(i => boardState[i] === player)
  );
}

function isDraw() {
  return cells.every(cell => cell !== "");
}

function restart() {
  cells = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  createBoard();
}

createBoard();