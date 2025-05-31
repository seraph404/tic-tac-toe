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
    const row = move[0] - 1;
    const col = move[1] - 1;

    // add checks here later OR do input sanitization eventually
    board[row][col] = marker;
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
    winningRows.forEach((combo) => {
      const [a, b, c] = combo.map(([row, col]) => board[row][col]);
      // look for a full line of matching non-empty characters
      if (a !== "_" && a === b && b === c) {
        // marker wins!
        console.log(`${a} wins!`);
      }
    });
  }

  return {
    createGameboard,
    displayGameboard,
    updateGameboard,
    checkForWinner,
  };
})();

function initializeGame() {
  return {};
}

//GameBoard().displayGameboard();

// GameBoard.createGameboard();
// GameBoard.displayGameboard();
//GameBoard.checkForWinner();
// GameBoard.updateGameboard([2, 2], "X");
//initializeGame();
