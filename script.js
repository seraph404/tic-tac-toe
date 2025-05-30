const GameBoard = (() => {
  const GRID_DIMENSION = 3;
  // let board = [];

  // make createBoard()
  // for (let y = 0; y < GRID_DIMENSION; y++) {
  //   board[y] = [];
  //   for (let x = 0; x < GRID_DIMENSION; x++) {
  //     board[y][x] = 0;
  //   }
  // }

  let board = [
    ["_", "X", "O"],
    ["O", "_", "X"],
    ["_", "O", "X"],
  ];

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

  return {
    displayGameboard,
    updateGameboard,
  };
})();

//GameBoard().displayGameboard();

GameBoard.displayGameboard();
GameBoard.updateGameboard([2, 2], "X");
