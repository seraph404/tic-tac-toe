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
    let num = 1;
    console.log(`\n    1   2   3`);
    // loop through each row in the board
    board.forEach((row) => {
      // display that row in the console
      const spacedRow = row.map((cell) => ` ${cell} `).join("|");
      console.log(`${num} |${spacedRow}|`);
      num += 1;
    });
  }

  function updateGameboard(move, marker) {
    // account for zero index
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

  GameBoard.createGameboard();
  GameBoard.displayGameboard();
  chooseFirstPlayer();

  if (currentPlayer === playerOne) {
    console.log(`To make your move, use play(row, column)`);
    console.log(`For example, play(2,2)`);
  } else {
    playTurn();
  }

  function chooseFirstPlayer() {
    console.log("Choosing first player...");
    currentPlayer = Math.random() < 0.5 ? playerOne : playerTwo;
    console.log(`First player is ${currentPlayer.name}.`);
  }

  function playHumanTurn(coords) {
    // adjust input coords to account for zero index
    const adjusted = [coords[0] - 1, coords[1] - 1];

    return applyMove(adjusted, playerOne.marker);
  }

  function playComputerTurn() {
    // look at the available coordinates
    const availableCoords = GameBoard.getAvailableCoords();
    // choose a move
    let index = Math.floor(Math.random() * availableCoords.length);
    const computerMove = availableCoords[index];

    applyMove(computerMove, playerTwo.marker);
  }

  function applyMove(move, marker) {
    const success = GameBoard.updateGameboard(move, marker);

    if (!success) {
      console.log("Invalid move! This space is already taken.");
      return false;
    }
    return true;
  }

  function playTurn(coords) {
    if (currentPlayer === playerOne) {
      const success = playHumanTurn(coords);
      if (!success) return;
    } else {
      playComputerTurn(coords);
    }

    const winnerFound = GameBoard.checkForWinner();
    if (winnerFound) {
      console.log(`${currentPlayer.name} has won!`);
      gameOver = true;
      return; // end game
    }

    if (GameBoard.isBoardFull()) {
      console.log("It's a tie!");
      gameOver = true;
      return; // end game
    }

    switchPlayer();
  }

  function switchPlayer() {
    if (currentPlayer === playerOne) {
      currentPlayer = playerTwo;
      console.log(`It's ${currentPlayer.name}'s turn!`);
      // this makes the computer player auto-play
      setTimeout(() => {
        playTurn();
      }, 1000);
    } else if (currentPlayer === playerTwo) {
      currentPlayer = playerOne;
      console.log(`It's ${currentPlayer.name}'s turn!`);
      console.log(`To make your move, use play(row, column)`);
      console.log(`For example, play(2,2)`);
    }
  }

  return {
    currentPlayer,
    playTurn,
    gameOver,
  };
}

// user-friendly wrappers for terminal
function start(name, marker) {
  window.game = initializeGame(name, marker);
}

function play(row, column) {
  if (!window.game) {
    console.log(`Please start a game first!`);
  }
  window.game.playTurn([row, column]);
}

console.log(`Welcome to Tic, Tac Toe: Console Edition`);
console.log(`To begin a game, use start(name, marker)`);
console.log(`For example: start('Seraphina', 'X')`);
