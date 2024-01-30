//Game
//has winstate, players, board
//can checkforwin, announcewinner, resetgame
//Use an IIFE for this
//This will create and call all other objects
const Game = () => {
    //let board = Board.createBoard()
    this.players = []
    this.gameStarted = false
    this.gameWon = false
    this.board = Object.create(Board())

    const setupGame = function() {
        //instantiate the board
        console.log(board.getBoard())
        board.clearBoard()

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
                    if (board.getBoard()[position] === '') {
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
            if (currentBoard[state[0]] === currentBoard[state[1]] && currentBoard[state[1]] === currentBoard[state[2]] && currentBoard[state[0]] !== '') {
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
            console.log(currentBoard)
            return
        }

        console.log('No winnings conditions detected, checking for cat\'s game.')
        //Check for full board state, declare Cat's game if full and above win conditions have not been met
        if(currentBoard.includes('')) {
            console.log('Board is not full')
        } else {
            //Board is full and no winner yet, cat's game
            console.log(currentBoard)
            console.log('Cat\'s game.')
            gameWon = true
            gameStarted = false
        }
    }
    return {setupGame, announcePlayers, checkForWin, startGame, checkForWin}
};

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
function Board() {
    let board = []

    const clearBoard = () => {
        board = ['', '', '', '', '', '', '', '', '']
    }
    const markBoard = (boardSpotNum, marker) => {
        //The 1 based index will be passed in, e.g. 1 means top left, 9 means bottom right
        //Subtract 1 from this numbder to get the array index and mark it
        arrayIndex = boardSpotNum
        board[arrayIndex] = marker
        console.log(`Marked board spot ${arrayIndex} with an ${marker}`);
    }
    const getBoard = () => board
    return {clearBoard, markBoard, getBoard}
};

//Space
//has position
//can updateMarker, enableclicks, disableclicks,
game = Object.create(Game())
game.setupGame()
game.announcePlayers()
game.startGame()

