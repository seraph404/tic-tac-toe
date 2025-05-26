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
