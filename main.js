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

    gameStartButton.addEventListener('click', (e) => {
        e.preventDefault()
        if (document.querySelector('#p1Input').value === '' || document.querySelector('#p2Input').value === '') {
            //One or more player names are not entered
            feedbackUpdate()
        } else if (gameStartButton.textContent === 'RESET') {
            setupGame()
        } else {
            //Take player names input and create player objects
            player1 = Object.create(Player(document.querySelector('#p1Input').value, 'X'))
            player2 = Object.create(Player(document.querySelector('#p2Input').value, 'O'))

            //Update the player name labels
            document.querySelector('#p1Name').textContent = player1.getName()
            document.querySelector('#p2Name').textContent = player2.getName()

            //Store the player objects in the players array
            players.push(player1)
            players.push(player2)

            //Update the page feedback to reflect players are set
            feedbackUpdate()

            //Start the game
            startGame()
        }
    })

    const setupGame = function() {
        players = []
        boardContainerDiv.innerHTML = ''
        gameWon = false
        gameActive = false
        activePlayer = 0

        //Instantiate two players
        
        feedbackUpdate()
    }
    const startGame = function() {

        //Set gameActive flag to true, this will be used to manage UI state later
        gameActive = true
        feedbackUpdate()

        //instantiate the board
        console.log(board.getBoard())
        board.createBoard()
    }

    const feedbackUpdate = function() {
        if (gameActive === true && gameWon === false) {
            document.querySelectorAll('.playerName').forEach(el => {
                el.style.display = 'block'
            })
            document.querySelectorAll('.playerInput').forEach(el => {
                el.style.display = 'none'
            })
            document.querySelector('.gameControls>button').textContent = 'RESET'
            gameFeedbackDiv.textContent = players[activePlayer].getName() + '\'s turn, place your '+ players[activePlayer].getMarker()
        }
        if (gameActive === false && gameWon == true) {
            gameFeedbackDiv.textContent = players[activePlayer].getName() + ' wins with 3 '+ players[activePlayer].getMarker() + '\'s!'
        }
        if (gameActive === false && gameWon == false) {
            document.querySelectorAll('.playerName').forEach(el => {
                el.style.display = 'none'
            })
            document.querySelectorAll('.playerInput').forEach(el => {
                el.style.display = 'block'
            })
            document.querySelector('.gameControls>button').textContent = 'START'
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
            board.drawWinline(winIndex)
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
        let winLine = document.createElement('div')
        winLine.classList.add('winLine')
        boardContainer.appendChild(winLine)
        winLine.style.visibility = 'hidden'
    }
    const clearBoard = () => {
        boardContainer.innerHTML = ''
        createBoard()
    }
    const markBoard = (boardSpotNum, marker) => {
        board[boardSpotNum] = marker
        document.querySelector('.space'+boardSpotNum).textContent = marker
        document.querySelector('.space'+boardSpotNum).classList.add('player'+marker)
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
    const drawWinline = (winIndex) => {
        let winLine = document.querySelector('.winLine')
        console.log(winLine)
        winLine.classList.add('winState'+winIndex)
        winLine.style.visibility = 'visible'
        document.querySelectorAll('.space').forEach((space) => {
            recreateNode(space)
        })
    }

    function recreateNode(el, withChildren) {
        if (withChildren) {
          el.parentNode.replaceChild(el.cloneNode(true), el);
        }
        else {
          var newEl = el.cloneNode(false);
          while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
          el.parentNode.replaceChild(newEl, el);
        }
      }

    return {createBoard, clearBoard, markBoard, getBoard, consoleBoard, drawWinline}
};

function BoardSpot() {
    
}

Game.setupGame()
