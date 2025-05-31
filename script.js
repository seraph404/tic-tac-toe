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
    displayGameboard();
  }

  // hard-coded board for debugging
  // let board = [
  //   ["_", "X", "_"],
  //   ["O", "_", "X"],
  //   ["_", "O", "X"],
  // ];

  function displayGameboard() {
    console.log(`==== GAMEBOARD ====`);
    let num = 1;
    // loop through each row in the board
    board.forEach((row) => {
      // display that row in the console
      console.log(`${num}     |${row.join("|")}|`);
      num += 1;
    });
  }

  function updateGameboard(move, marker) {
    // account for zero index
    const row = move[0];
    const col = move[1];

    // add checks here later OR do input sanitization eventually
    board[row][col] = marker;

    logGameState("Board updated");
    displayGameboard();
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
    checkForWinner,
    getAvailableCoords,
  };
})();

function createPlayer(name, marker) {
  return { name, marker };
}

// helping to track the game state
function logGameState(msg, { lastMove } = {}) {
  console.log(`GAME STATE: ${msg}`);

  if (lastMove) console.log(`Move coords: ${lastMove}`);
}

function initializeGame(name, marker) {
  // set no winner by default
  let hasWinner = false;

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
  // hard-coding for now
  currentPlayer = playerOne;

  GameBoard.createGameboard();
  //GameBoard.displayGameboard();

  console.log(`Hi, ${playerOne.name}, you are ${playerOne.marker}!`);
  console.log(`First player is ${currentPlayer.name}.`);

  if (currentPlayer === playerOne) {
    console.log(`To make your move, use playTurn([X,Y])`);
    console.log(`...where X is the row, and Y is the column`);
    console.log(
      `For example, to place a marker at the center position, use playTurn([2,2])`
    );
  }

  function playHumanTurn(coords) {
    // adjust input coords to account for zero index
    const adjusted = [coords[0] - 1, coords[1] - 1];

    applyMove(adjusted, playerOne.marker);
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
    GameBoard.updateGameboard(move, marker);
    logGameState(currentPlayer.name + " has made their move.", {
      lastMove: move,
    });
  }

  function playTurn(coords) {
    if (currentPlayer === playerOne) {
      playHumanTurn(coords);
    } else {
      playComputerTurn(coords);
    }

    const winnerFound = GameBoard.checkForWinner();
    if (winnerFound) {
      console.log(`${currentPlayer.name} has won!`);
      return; // end game
    }

    switchPlayer();
  }

  function switchPlayer() {
    if (currentPlayer === playerOne) {
      currentPlayer = playerTwo;
      console.log(`It's ${currentPlayer.name}'s turn!`);
      // this makes the computer player auto-play
      //playTurn();
    } else if (currentPlayer === playerTwo) {
      currentPlayer = playerOne;
      console.log(`It's ${currentPlayer.name}'s turn!`);
    }
  }

  //playTurn([1, 1]);
  //switchPlayer();

  return {
    hasWinner,
    currentPlayer,
    playTurn,
  };
}

// makes user-friendly
function start(name, marker) {
  window.game = initializeGame(name, marker);
}

console.log(`Welcome to Tic, Tac Toe: Console Edition`);
console.log(`To begin a game, use start(name, marker)`);
console.log(`For example: start('Seraphina', 'X')`);

//GameBoard().displayGameboard();

// GameBoard.createGameboard();
// GameBoard.displayGameboard();
//GameBoard.checkForWinner();
// GameBoard.updateGameboard([2, 2], "X");
//const game = initializeGame("Seraphina", "X");

// notes for testing
// use game.playTurn([1,1]); syntax for making a move
