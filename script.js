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
      for (let row of board) {
        console.log(row.map((cell) => (cell === 0 ? "-" : cell)).join(" | "));
      }
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
