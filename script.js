const GameBoard = (() => {
  // private variable
  const board = [];

  return {
    // this creates a 3x3 grid as a 2D array with 0 as a starting value
    createBoard: function () {
      board.length = 0; // clear previous contents
      for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
          board[i][j] = 0;
        }
      }
      return board;
    },
    // creates a board to be displayed during console.log
    displayBoard: function () {
      board.forEach((row, i) => {
        console.log(
          // adds a number in front of each row
          `${i + 1}: ` +
            row.map((cell) => (cell === 0 ? "-" : cell)).join(" | ")
        );
      });
    },
    updateBoard: function (move, marker) {
      // account for zero index
      let row = parseInt(move[0]) - 1;
      let col = parseInt(move[1]) - 1;
      board[row][col] = marker;
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

    // check for empty input or cancel
    if (!playerMove) {
      console.log("No input received. Please try again.");
      return getPlayerMove();
    }

    // validate input
    playerMove = playerMove.trim(); // accounts for whitespace
    // becomes array
    const parts = playerMove.split(",");

    if (parts.length !== 2) {
      console.log("Invalid format. Use 'row,column' format (e.g., 2,3).");
      return getPlayerMove();
    }

    const row = parseInt(parts[0], 10);
    const col = parseInt(parts[1], 10);
    if (isNaN(row) || isNaN(col) || row < 1 || row > 3 || col < 1 || col > 3) {
      console.log("Rows and columns must be numbers between 1 and 3.");
      return getPlayerMove();
    }

    const board = GameBoard.getAvailableMoves();
    if (!board.includes(`${row},${col}`)) {
      console.log("That spot is already taken. Try a different move.");
      return getPlayerMove();
    }

    GameBoard.updateBoard([row, col], currentPlayer.marker);
    GameBoard.displayBoard();

    switchPlayer();
  }

  function getComputerMove() {
    const availableMoves = GameBoard.getAvailableMoves();
    const index = Math.floor(Math.random() * availableMoves.length);
    const moveString = availableMoves[index];
    const moveParts = moveString.split(",").map(Number);
    GameBoard.updateBoard(moveParts, currentPlayer.marker);
    GameBoard.displayBoard();
    switchPlayer();
  }

  function playTurn() {
    let gameOver = false;
    const winner = GameBoard.checkForWinner();
    if (!winner) {
      // check for draw
      if (GameBoard.getAvailableMoves().length === 0) {
        console.log("It's a draw!");
        return;
      }
      if (currentPlayer === player1) {
        getPlayerMove();
      } else {
        getComputerMove();
      }
    } else {
      gameOver = true;
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
  currentPlayer = decideFirstPlayer([player1, player2]);
  playTurn();
  //getPlayerMove();
  //getComputerMove();

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
