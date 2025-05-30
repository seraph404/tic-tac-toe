function GameBoard() {
  const GRID_DIMENSION = 3;
  // let board = [];

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
    // loop through each row in the board
    board.forEach((row) => {
      // display that row in the console
      console.log(`      |${row.join("|")}|`);
    });
  }

  return {
    displayGameboard,
  };
}

GameBoard().displayGameboard();
