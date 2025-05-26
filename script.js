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
      // account for zero index
      let row = parseInt(move[0]) - 1;
      let col = parseInt(move[1]) - 1;
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
            // account for zero index
            availableMoves.push(row + 1 + "," + (col + 1));
          }
        }
      }
      // return an array of available moves
      return availableMoves;
    },
    checkForWinner: function () {
      // check rows
      for (let row = 0; row < 3; row++) {
        if (
          board[row][0] !== 0 &&
          board[row][0] === board[row][1] &&
          board[row][1] === board[row][2]
        ) {
          return board[row][0]; // return marker of winner
        }
      }

      // check columns
      for (let col = 0; col < 3; col++) {
        if (
          board[0][col] !== 0 &&
          board[0][col] === board[1][col] &&
          board[1][col] === board[2][col]
        ) {
          return board[0][col];
        }
      }

      // check diagonals
      if (
        board[0][0] !== 0 &&
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2]
      ) {
        return board[0][0];
      }

      if (
        board[0][2] !== 0 &&
        board[0][2] === board[1][1] &&
        board[1][1] === board[2][0]
      ) {
        return board[0][2];
      }

      return null; // no winner yet
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
    const winner = GameBoard.checkForWinner();
    if (!winner) {
      if (currentPlayer === player1) {
        getPlayerMove();
        switchPlayer();
      } else {
        getComputerMove();
        switchPlayer();
      }
    } else {
      console.log("We have a winner!");
      const winningPlayer = winner === player1.marker ? player1 : player2;
      console.log(`🎉 ${winningPlayer.name} wins with '${winner}'!`);
    }
  }

  function switchPlayer() {
    console.log("Switching player...");
    if (currentPlayer === player1) {
      currentPlayer = player2;
      playTurn();
    } else {
      currentPlayer = player1;
      playTurn();
    }
  }

  GameBoard.createBoard();
  GameBoard.displayBoard();
  decideFirstPlayer([player1, player2]);
  playTurn();
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
