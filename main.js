//Game
//has winstate, players, board
//can checkforwin, announcewinner, resetgame
//Use an IIFE for this
//This will create and call all other objects
const Game = (() => {
    //let board = Board.createBoard()
    this.players = []
    this.activePlayer = 0
    this.gameActive = false
    this.gameWon = false
    this.gameControlsDiv = document.querySelector('.gameControls')
    this.gameStartButton = document.querySelector('.gameControls>button')
    this.boardContainerDiv = document.querySelector('.boardContainer')
    this.gameFeedbackDiv = document.querySelector('.gameFeedback')
    this.board = Object.create(Board(boardContainerDiv))

    const setupGame = function() {
        //Instantiate two players
        gameStartButton.addEventListener('click', (e) => {
            if (document.querySelector('#p1Input').value === '' || document.querySelector('#p2Input').value === '') {
                feedbackUpdate()
            } else {
                player1 = Object.create(Player(document.querySelector('#p1Input').value, 'X'))
                player2 = Object.create(Player(document.querySelector('#p2Input').value, 'O'))

                //Store the player objects in the players array
                players.push(player1)
                players.push(player2)
                startGame()

            }
        })
        
        feedbackUpdate()
    }
    const startGame = function() {


        //Store the player objects in the players array
        players.push(player1)
        players.push(player2)

        //Set gameActive flag to true, this will be used to manage UI state later
        gameActive = true
        feedbackUpdate()

        //instantiate the board
        console.log(board.getBoard())
        board.createBoard()
    }

    const feedbackUpdate = function() {
        if (gameActive === true && gameWon === false) {
            gameFeedbackDiv.textContent = players[activePlayer].getName() + '\'s turn, place your '+ players[activePlayer].getMarker()
        }
        if (gameActive === false && gameWon == true) {
            gameFeedbackDiv.textContent = players[activePlayer].getName() + ' wins with 3 '+ players[activePlayer].getMarker() + '\'s!'
        }
        if (gameActive === false && gameWon == false) {
            gameFeedbackDiv.textContent = 'Enter player names to start.'
        }
    }
    const announcePlayers = function () {
        console.log(`The players are ${players[0].getName()} and ${players[1].getName()}`)
        console.log(`${players[0].getName()} is using ${players[0].getMarker()}`)
        console.log(`${players[1].getName()} is using ${players[1].getMarker()}`)
    }
    const turnHandler = function (boardSpace) {
        board.markBoard(boardSpace, players[activePlayer].getMarker())
        checkForWin()
        if (!gameWon){
            activePlayer = activePlayer === 0 ? 1 : 0
        }
        feedbackUpdate()
    }
    const checkForWin = function() {
        //Make sure the board is not full
        currentBoard = board.getBoard()

        winStates = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        winIndex = null
        winStates.forEach((state) => {
            if (currentBoard[state[0]] === currentBoard[state[1]] && currentBoard[state[1]] === currentBoard[state[2]] && currentBoard[state[0]] !== ' ') {
/*                 if (currentBoard[state[0]] === players[0].getMarker()) {
                    console.log(players[0].getName() + ' wins! Winning selections: ' + state);
                    gameFeedbackDiv.textContent = players[activePlayer]
                } else {
                    console.log(players[1].getName() + ' wins! Winning selections: ' + state);
                } */
                winIndex = winStates.indexOf(state)
                gameWon = true
                gameActive = false
            }
        })

        if (gameWon) {
            board.consoleBoard()

            //Send winIndex to Board, if it's 0-2 it's horiz, 3-5 is vert, 6 is tl to br diag, 7 is tr to bl diag
            return
        }

        console.log('No winnings conditions detected, checking for cat\'s game.')
        //Check for full board state, declare Cat's game if full and above win conditions have not been met
        if(currentBoard.includes(' ')) {
            console.log('Board is not full')
        } else {
            //Board is full and no winner yet, cat's game
            board.consoleBoard()
            console.log('Cat\'s game.')
            gameWon = true
            gameStarted = false
            return
        }

    }
    const completeGame = function(winningPlayer, winState) {
        //Draw winning line
        //Announce winner
        //Prompt user to play again with a button that has startGame() attached
    }
    const getActivePlayer = () => players[activePlayer]
    return {setupGame, announcePlayers, checkForWin, startGame, getActivePlayer, turnHandler}
})();

//Player
//has name, marker
//can taketurn, setname
const Player = function(name, marker) {
    this.name = name
    this.marker = marker
    const getName = () => name
    const getMarker = () => marker
    const takeTurn = (boardSpace) => {
        //Prompt the user to take a turn "John, you're up. Place your X on the board!"
        Game.turnHandler(boardSpace)        
    }

    return {getName, getMarker, takeTurn}
};

//Board
//has spaces
//can overlaywinline, createBoard, clearBoard
function Board(boardDiv) {
    let board = []
    let boardContainer = boardDiv
    const createBoard = () => {
        board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        board.forEach((space, index) => {
            let boardSpace = document.createElement('div')
            boardSpace.classList.add('space'+index)
            boardSpace.classList.add('space')
            boardSpace.addEventListener('click', event => processClick(event))
            boardContainer.appendChild(boardSpace)
            console.log(space + index)
        })
    }
    const clearBoard = () => {
        boardContainer.innerHTML = ''
        createBoard()
    }
    const markBoard = (boardSpotNum, marker) => {
        board[boardSpotNum] = marker
        document.querySelector('.space'+boardSpotNum).textContent = marker
        console.log(`Marked board spot ${boardSpotNum} with an ${marker}`)

    }
    const getBoard = () => board
    const consoleBoard = () => {
        console.log(board[0]+board[1]+board[2])
        console.log(board[3]+board[4]+board[5])
        console.log(board[6]+board[7]+board[8])
    }
    function processClick(e) {
        player = Game.getActivePlayer()
        //Class list includes 'space#' where the # represents the index of the board space, slice to get the #
        boardSpace = e.target.classList[0].slice(-1)
        if (e.target.textContent === '') {
            console.log('Empty space')
            player.takeTurn(boardSpace)
        }

    }
    const drawWinline = () => {

    }
    return {createBoard, clearBoard, markBoard, getBoard, consoleBoard, drawWinline}
};

function BoardSpot() {
    
}

Game.setupGame()
