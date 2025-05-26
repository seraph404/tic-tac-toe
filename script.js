const GameBoard = (() => {
  const board = [];

  return {
    // this creates the board array
    createBoard: function () {
      // creates the gameboard 2D array
      let rows = 3;
      let columns = 3;
      for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i][j] = 0;
        }
      }

      return board;
    },
    displayBoard: function () {
      board.forEach((row, i) => {
        console.log(
          `${i + 1}: ` +
            row.map((cell) => (cell === 0 ? "-" : cell)).join(" | ")
        );
      });
    },
    updateBoard: function (move, marker) {
      // becomes array
      move = move.split(",");
      let row = move[0];
      let col = move[1];
      board[row][col] = marker;
      // display the board with the new move
      this.displayBoard();
    },
  };
})();

const createPlayer = (name, marker) => {
  return { name, marker };
};

const initializeGame = (name) => {
  // identify player2 marker based on input
  let playerTwoMarker;
  const player1 = createPlayer(name, "X");
  playerTwoMarker = player1.marker === "X" ? "O" : "X";
  const player2 = createPlayer("Player 2", playerTwoMarker);

  function getPlayerMove() {
    let playerMove = prompt("Enter your move as 'row,column':");
    //console.log(playerMove);
    GameBoard.updateBoard(playerMove, "X");
  }

  function getComputerMove() {
    // stuff here
  }

  GameBoard.createBoard();
  GameBoard.displayBoard();
  getPlayerMove();

  return {
    board: GameBoard,
    players: [player1, player2],
  };
};

// const welcomeText = (() => {
//   console.log("====================");
//   console.log("Welcome to Tic Tac Toe!");
//   console.log("To begin, you can use the initializeGame function.");
//   console.log(
//     "You'll want to provide your name and the marker you'd like to use as arguments."
//   );
//   console.log("Like this: initializeGame('Seraphina', 'X')");
// })();

initializeGame("Seraphina", "X");
