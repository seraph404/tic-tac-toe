const GameBoard = (() => {
  const board = [];

  return {
    createBoard: function () {
      let rows = 3;
      let columns = 3;

      // creating two-dimensional array
      for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i][j] = 0;
        }
      }

      console.log(board);
    },
  };
})();

const createPlayer = (name, marker) => {
  return { name, marker };
};

const initializeGame = (name) => {
  let playerTwoMarker;
  const player1 = createPlayer(name, "X");
  playerTwoMarker = player1.marker === "X" ? "O" : "X";
  const player2 = createPlayer("Player 2", playerTwoMarker);

  return {
    board: GameBoard,
    players: [player1, player2],
  };
};

const welcomeText = (() => {
  console.log("====================");
  console.log("Welcome to Tic Tac Toe!");
  console.log("To begin, you can use the initializeGame function.");
  console.log(
    "You'll want to provide your name and the marker you'd like to use as arguments."
  );
  console.log("Like this: initializeGame('Seraphina', 'X')");
})();
