const GameBoard = (() => {
  const GRID_DIMENSION = 3;
  let board = [];

  function createGameboard() {
    for (let y = 0; y < GRID_DIMENSION; y++) {
      board[y] = [];
      for (let x = 0; x < GRID_DIMENSION; x++) {
        board[y][x] = "_";
      }
    }
  }

  function displayGameboard() {
    const gameBoardDiv = document.querySelector("#game-board");
    gameBoardDiv.innerHTML = "";

    // populates the grid according to the board array
    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        let gridCell = document.createElement("div");
        // assign the div a data-id of row-column
        gridCell.dataset.id = `${rowIndex}${cellIndex}`;
        gameBoardDiv.append(gridCell);

        // if cell is not a blank spot...
        if (cell !== "_") {
          let markerCell = document.createElement("div");
          markerCell.textContent = cell;
          markerCell.classList.add("marker-cell");
          gridCell.append(markerCell);
        }
      });
    });
  }

  function updateGameboard(move, marker) {
    const row = move[0];
    const col = move[1];

    // only allow addition if board is blank
    if (board[row][col] === "_") {
      board[row][col] = marker;
      displayGameboard();
      return true;
    }

    displayGameboard();
    return false;
  }

  function isBoardFull() {
    return getAvailableCoords().length === 0;
  }

  function checkForWinner() {
    // prettier-ignore
    // map out winning combos via index
    const winningRows = [
      [[0, 0], [0, 1], [0, 2]], // top row
      [[1, 0], [1, 1], [1, 2]], // middle row
      [[2, 0], [2, 1], [2, 2]], // bottom row
      [[0, 0], [1, 0], [2, 0]], // left column
      [[0, 1], [1, 1], [2, 1]], // middle column
      [[0, 2], [1, 2], [2, 2]], // right column
      [[0, 0], [1, 1], [2, 2]], // diagonal bottom-top
      [[0, 2], [1, 1], [2, 0]], // diagonal top-bottom
  ];

    // loop over each combination in the array
    for (const combo of winningRows) {
      const [a, b, c] = combo.map(([row, col]) => board[row][col]);
      // look for a full line of matching non-empty characters
      if (a !== "_" && a === b && b === c) {
        // marker wins!
        console.log(`${a} wins!`);
        return true;
      }
    }

    return false; // only return false after checking all combos
  }

  function getAvailableCoords() {
    let availableCoords = [];
    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        // if the cell is blank
        if (cell === "_") {
          availableCoords.push([y, x]);
        }
      });
    });
    return availableCoords;
  }

  return {
    createGameboard,
    displayGameboard,
    updateGameboard,
    isBoardFull,
    checkForWinner,
    getAvailableCoords,
  };
})();

function createPlayer(name, marker) {
  return { name, marker };
}

function initializeGame(name, marker) {
  let gameOver = false;
  inputLocked = false;

  // check to ensure marker is valid (only needed for console)
  if (marker !== "X" && marker !== "O") {
    throw new Error(
      `Invalid marker. You must choose "X" or "O" as your marker.`
    );
  }

  const playerOne = createPlayer(name, marker);

  const playerTwoMarker = playerOne.marker === "X" ? "O" : "X";
  const playerTwo = createPlayer("Computer", playerTwoMarker);

  let currentPlayer;

  chooseFirstPlayer();
  GameBoard.createGameboard();
  GameBoard.displayGameboard();

  const gameBoardDiv = document.querySelector("#game-board");
  gameBoardDiv.addEventListener("click", clickHandler);

  function clickHandler() {
    if (inputLocked || gameOver) return;
    const coords = event.target.dataset.id.split("").map(Number);
    playTurn(coords);
  }

  function renderOutput(output) {
    const outputDiv = document.querySelector("#output");
    outputDiv.textContent = output;
  }

  function chooseFirstPlayer() {
    currentPlayer = Math.random() < 0.5 ? playerOne : playerTwo;
  }

  if (currentPlayer === playerTwo) {
    // Let the computer take the first turn after a slight delay
    renderOutput(`It's ${currentPlayer.name}'s turn!`);
    setTimeout(() => {
      playTurn();
    }, 1000);
  } else {
    // Let the player know it's their turn
    renderOutput(`It's ${currentPlayer.name}'s turn!`);
  }

  function playHumanTurn(coords) {
    return applyMove(coords, playerOne.marker);
  }

  function playComputerTurn() {
    // look at the available coordinates
    const availableCoords = GameBoard.getAvailableCoords();
    // choose a move
    let index = Math.floor(Math.random() * availableCoords.length);
    const computerMove = availableCoords[index];

    const success = applyMove(computerMove, playerTwo.marker);
    if (!success) return;

    evaluateGameState();
  }

  function isWithinBounds([row, col]) {
    return row >= 0 && row < 3 && col >= 0 && col < 3;
  }

  function evaluateGameState() {
    const winnerFound = GameBoard.checkForWinner();

    if (winnerFound || GameBoard.isBoardFull()) {
      if (winnerFound) {
        renderOutput(`Game over. ${currentPlayer.name} has won!`);
      }
      if (!winnerFound && GameBoard.isBoardFull()) {
        renderOutput("Game over. It's a tie!");
      }

      gameOver = true;
      document.querySelector("#new-game").disabled = false;
      return true;
    }

    return false;
  }

  function applyMove(move, marker) {
    if (!isWithinBounds(move)) {
      console.log(
        "Invalid move! Each coordinate must be a number between 1-3."
      );
      return false;
    }

    const success = GameBoard.updateGameboard(move, marker);

    if (!success) {
      console.log("Invalid move! This space is already taken.");
      return false;
    }
    return true;
  }

  function playTurn(coords) {
    if (gameOver) {
      console.log(`Game is already over. Please start a new game.`);
      return;
    }

    renderOutput(`It's ${currentPlayer.name}'s turn!`); //

    if (currentPlayer === playerOne) {
      const success = playHumanTurn(coords);
      if (!success) return;
    } else {
      playComputerTurn(coords);
    }

    if (evaluateGameState()) return;
    switchPlayer();
  }

  function switchPlayer() {
    if (currentPlayer === playerOne) {
      currentPlayer = playerTwo;
      renderOutput(`It's ${currentPlayer.name}'s turn!`);
      inputLocked = true;
      // this makes the computer player auto-play
      setTimeout(() => {
        if (!gameOver) {
          playTurn();
          inputLocked = false;
        }
      }, 1000);
    } else if (currentPlayer === playerTwo) {
      currentPlayer = playerOne;
      renderOutput(`It's ${currentPlayer.name}'s turn!`);
    }
  }

  return {
    currentPlayer,
    playTurn,
    gameOver,
  };
}
let name = undefined;
const newGameBtn = document.querySelector("#new-game");
newGameBtn.addEventListener("click", () => {
  console.log(`${name} is ...`);
  if (name === undefined) {
    name = prompt("What should we call you?");
  }
  initializeGame(name, "X");
  newGameBtn.disabled = true;
});

// starts the game with a blank grid
GameBoard.displayGameboard();
