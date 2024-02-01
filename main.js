//Game
//has winstate, players, board
//can checkforwin, announcewinner, resetgame
//Use an IIFE for this
//This will create and call all other objects
const Game = (() => {
    //let board = Board.createBoard()
    this.players = []
    this.gameStarted = false
    this.gameWon = false
    this.gameControlsDiv = document.querySelector('.gameControls')
    this.boardContainerDiv = document.querySelector('.boardContainer')
    this.gameFeedbackDiv = document.querySelector('.gameFeedback')
    this.board = Object.create(Board(boardContainerDiv))

    const setupGame = function() {
        //instantiate the board
        console.log(board.getBoard())
        board.createBoard()
        board.displayBoard()

        //Instantiate two players
        let player1 = Object.create(Player('Josh', 'X'))
        let player2 = Object.create(Player('Lisa', 'O'))
        
        //Store the player objects in the players array
        players.push(player1)
        players.push(player2)
    }
    const startGame = function() {
        //Set gamestarted flag to true, this will be used to manage UI state later
        gameStarted = true

        //Keep rotating through players until a gameWon state is detected
        while (!gameWon) {

            for (const player of players) {

                turnComplete = false
                while(!turnComplete) {
                    position = player.takeTurn()
                    if (board.getBoard()[position] === ' ') {
                        board.markBoard(position, player.getMarker())
                        turnComplete = true
                    } else {
                        console.log('That spot is taken.');
                    }
                }
                checkForWin()
                if (gameWon) break
            }
            //break
        }
    }
    const announcePlayers = function () {
        console.log(`The players are ${players[0].getName()} and ${players[1].getName()}`)
        console.log(`${players[0].getName()} is using ${players[0].getMarker()}`)
        console.log(`${players[1].getName()} is using ${players[1].getMarker()}`)
    }
    const checkForWin = function() {
        //Make sure the board is not full
        currentBoard = board.getBoard()

        winStates = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

        winStates.forEach((state) => {
            if (currentBoard[state[0]] === currentBoard[state[1]] && currentBoard[state[1]] === currentBoard[state[2]] && currentBoard[state[0]] !== ' ') {
                if (currentBoard[state[0]] === players[0].getMarker()) {
                    console.log(players[0].getName() + ' wins! Winning selections: ' + state);
                } else {
                    console.log(players[1].getName() + ' wins! Winning selections: ' + state);
                }
                gameWon = true
                gameStarted = false
            }
        })

        if (gameWon) {
            board.displayBoard()
            return
        }

        console.log('No winnings conditions detected, checking for cat\'s game.')
        //Check for full board state, declare Cat's game if full and above win conditions have not been met
        if(currentBoard.includes(' ')) {
            console.log('Board is not full')
        } else {
            //Board is full and no winner yet, cat's game
            board.displayBoard()
            console.log('Cat\'s game.')
            gameWon = true
            gameStarted = false
        }
    }
    const completeGame = function(winningPlayer) {
        //Draw winning line
        //Announce winner
        //Prompt user to play again with a button that has startGame() attached
    }
    return {setupGame, announcePlayers, checkForWin, startGame}
})();

//Player
//has name, marker
//can taketurn, setname
const Player = function(name, marker) {
    this.name = name
    this.marker = marker
    const getName = () => name
    const getMarker = () => marker
    const takeTurn = () => {
        //Prompt the user to take a turn "John, you're up. Place your X on the board!"
        //Await click
        //Currently just using random, this will return 0-8

        let selectedPosition = Math.floor(Math.random() * 9)
        console.log(`${name} requests space ${selectedPosition}`)
        return selectedPosition
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
            boardSpace.addEventListener('click', e => processClick(e))
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
    const displayBoard = () => {
        console.log(board[0]+board[1]+board[2])
        console.log(board[3]+board[4]+board[5])
        console.log(board[6]+board[7]+board[8])
    }
    const processClick = (e) => {
        console.log()
    }
    const drawWinline = () => {

    }
    return {createBoard, clearBoard, markBoard, getBoard, displayBoard, drawWinline}
};

function BoardSpot() {
    
}

Game.setupGame()
Game.announcePlayers()
Game.startGame()
