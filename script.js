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
    getAvailableMoves: function () {
      let availableMoves = [];
      // loop through the board
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          let value = board[row][col];
          if (value === 0) {
            availableMoves.push(row + "," + col);
          }
        }
      }
      // return an array of available moves
      return availableMoves;
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
  let currentPlayer;

  function decideFirstPlayer(players) {
    const randomIndex = Math.floor(Math.random() * players.length);
    console.log(`The first player is ${players[randomIndex].name}!`);
    currentPlayer = players[randomIndex];
    return players[randomIndex];
  }

  function getPlayerMove() {
    let playerMove = prompt("Enter your move as 'row,column':");
    //console.log(playerMove);
    GameBoard.updateBoard(playerMove, "X");
  }

  function getComputerMove() {
    const availableMoves = GameBoard.getAvailableMoves();
    const index = Math.floor(Math.random() * availableMoves.length);
    GameBoard.updateBoard(availableMoves[index], "O");
  }

  function playTurn() {
    if (currentPlayer === player1) {
      getPlayerMove();
      switchPlayer();
    } else {
      getComputerMove();
      switchPlayer();
    }
  }

  function switchPlayer() {
    if (currentPlayer === player1) {
      currentPlayer === player2;
    } else {
      currentPlayer === player1;
    }
  }

  GameBoard.createBoard();
  GameBoard.displayBoard();
  decideFirstPlayer([player1, player2]);
  //playTurn();
  //getPlayerMove();
  //getComputerMove();

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
