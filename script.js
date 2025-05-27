const GameBoard = (() => {
  const board = [];

  function createBoard() {
    board.length = 0; // clear previous contents
    for (let i = 0; i < 3; i++) {
      board[i] = [];
      for (let j = 0; j < 3; j++) {
        board[i][j] = 0;
      }
    }
    return board;
  }

  function displayBoard() {
    // add grid squares to DOM
    const gameBoardDiv = document.querySelector("#game-board");
    // clear any existing content
    gameBoardDiv.innerHTML = "";
    // create the divs and use data attributes to track positioning
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.dataset.row = i + 1; // account for zero index
        div.dataset.col = j + 1;
        div.textContent = board[i][j] === 0 ? "" : board[i][j]; // adds to page
        gameBoardDiv.appendChild(div);
      }
    }
  }

  function updateBoard(move, marker) {
    // account for zero index
    let row = parseInt(move[0]) - 1;
    let col = parseInt(move[1]) - 1;
    board[row][col] = marker;
  }
  function getAvailableMoves() {
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
  }

  function checkForWinner() {
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
  }

  return {
    createBoard,
    displayBoard,
    updateBoard,
    getAvailableMoves,
    checkForWinner,
  };
})();

const createPlayer = (name, marker) => {
  return { name, marker };
};

const initializeGame = (name) => {
  let gameOver = false;
  let currentPlayer;
  GameBoard.createBoard();
  GameBoard.displayBoard();

  // identify player2 marker based on input
  let playerTwoMarker;
  const player1 = createPlayer(name, "X");
  playerTwoMarker = player1.marker === "X" ? "O" : "X";
  const player2 = createPlayer("Player 2", playerTwoMarker);

  function decideFirstPlayer(players) {
    const randomIndex = Math.floor(Math.random() * players.length);
    //console.log(`The first player is ${players[randomIndex].name}!`);
    currentPlayer = players[randomIndex];
    return players[randomIndex];
  }

  // add event listeners for clicks on grid
  // this is now the player input
  const gameBoardDiv = document.querySelector("#game-board");
  gameBoardDiv.addEventListener("click", (e) => {
    if (gameOver) return;

    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    if (e.target.textContent === "") {
      GameBoard.updateBoard([row, col], currentPlayer.marker);
      GameBoard.displayBoard();
      playTurn();
    }
  });

  // == CONSOLE-ONLY VERSION ==

  // function getPlayerMove(move) {
  //   let playerMove = prompt("Enter your move as 'row,column':");

  //   // check for empty input or cancel
  //   if (!playerMove) {
  //     console.log("No input received. Please try again.");
  //     return getPlayerMove();
  //   }

  //   // validate input
  //   playerMove = playerMove.trim(); // accounts for whitespace
  //   // becomes array
  //   const parts = playerMove.split(",");

  //   if (parts.length !== 2) {
  //     console.log("Invalid format. Use 'row,column' format (e.g., 2,3).");
  //     return getPlayerMove();
  //   }

  //   const row = parseInt(parts[0], 10);
  //   const col = parseInt(parts[1], 10);
  //   if (isNaN(row) || isNaN(col) || row < 1 || row > 3 || col < 1 || col > 3) {
  //     console.log("Rows and columns must be numbers between 1 and 3.");
  //     return getPlayerMove();
  //   }

  //   const board = GameBoard.getAvailableMoves();
  //   if (!board.includes(`${row},${col}`)) {
  //     console.log("That spot is already taken. Try a different move.");
  //     return getPlayerMove();
  //   }
  //   console.log(
  //     `${currentPlayer.name} played ${currentPlayer.marker} at ${row}, ${col}.`
  //   );
  //   GameBoard.updateBoard([row, col], currentPlayer.marker);

  //   switchPlayer();
  // }

  function getComputerMove() {
    const availableMoves = GameBoard.getAvailableMoves();
    const index = Math.floor(Math.random() * availableMoves.length);
    const moveString = availableMoves[index];
    let moveParts = moveString.split(",");
    const row = moveParts[0];
    const col = moveParts[1];
    //console.log(
    //  `${currentPlayer.name} played ${currentPlayer.marker} at ${row}, ${col}.`
    //);
    moveParts = moveParts.map(Number);
    GameBoard.updateBoard(moveParts, currentPlayer.marker);
    GameBoard.displayBoard();
  }

  function playTurn() {
    const outputDiv = document.querySelector("#output");
    const p = document.createElement("p");

    const winner = GameBoard.checkForWinner();

    if (!winner) {
      // check for draw
      if (GameBoard.getAvailableMoves().length === 0) {
        p.textContent = "Game over! It's a draw!";
        outputDiv.append(p);
        return;
      }
    } else {
      gameOver = true;
      const winningPlayer = winner === player1.marker ? player1 : player2;
      p.textContent = `🎉 ${winningPlayer.name} wins with '${winner}'!`;
      const gameBoardDiv = document.querySelector("#game-board");
      console.log(`🎉 ${winningPlayer.name} wins with '${winner}'!`);
      outputDiv.append(p);
    }
    switchPlayer();
  }

  function switchPlayer() {
    // switch the current player
    currentPlayer = currentPlayer === player1 ? player2 : player1;

    if (currentPlayer === player2) {
      getComputerMove();
    }
  }

  currentPlayer = decideFirstPlayer([player1, player2]);
  playTurn();

  return {
    board: GameBoard,
    players: [player1, player2],
    gameOver,
  };
};

// == CONSOLE-ONLY VERSION ==
// const welcomeText = (() => {
//   console.log("====================");
//   console.log("Welcome to Tic Tac Toe!");
//   console.log("To begin, you can use the initializeGame function.");
//   console.log(
//     "You'll want to provide your name and the marker you'd like to use as arguments."
//   );
//   console.log("Like this: initializeGame('Seraphina', 'X')");
// })();

GameBoard.createBoard();
GameBoard.displayBoard();

const newGameBtn = document.querySelector("#new-game");
newGameBtn.addEventListener("click", (e) => {
  initializeGame("Seraphina");
});

// == NOTES ==
// - The webpage loads
// - GameBoard.createBoard() and GameBoard.displayBoard() are executed.
// - The user selects 'New Game' button.
// - initializeGame() is executed.
// - The gameOver variable is set to false.
// - The currentPlayer variable is created.
// - The players are created.
// - An eventListener is applied to the gameBoardDiv,
// - currentPlayer is decided at random via decideFirstPlayer().
// - If the currentPlayer is player1, click anywhere on grid to place marker.
// - playTurn() is executed.
// - UI elements are created for player feedback.
// - switchPlayer() is executed.
// - The currentPlayer is reassigned.
// - If player2, getComputerMove() is executed.
// - Available moves are calculated with getAvailableMoves();
// - An available move is chosen randomly.
// - The move is logged to the board array and applied to the page.
