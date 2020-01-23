'use strict';
const FLAG='🚩';
var NORMAL = '😀';
var LOSE = '😧';
var WIN = '😎';
const MINES = '💣';
const EMPTY = '';
var gInterval;
var gTotalSeconds = 0;
var size;
var gBoard;
var isFirstClicked = true;
var gGame;
var gMines = { isShown: true, valu: MINES }
var countMines;
var gLevel = {
    SIZE: 0,
    MINES: 0
}


// This is called when page loads

function resetVars() {
     gInterval = null;
     gTotalSeconds = 0;
     size = 4;
     isFirstClicked = true;
     countMines = 2;
     var elSmile = document.querySelector('.restartFace');
elSmile.innerHTML = NORMAL;
pauseTimer();
}

// A function that determines board size and some mines

function difficulties(buttonPressed) {
    resetVars()
    if (buttonPressed === 'Beginner') {
        gLevel.SIZE = 4;
        size = 4;
        gLevel.MINES = 2;
        countMines = 2;
        gBoard = buildBoard(size);
        renderBoard(gBoard);
    } else if (buttonPressed === 'Medium') {
        gLevel.SIZE = 8;
        size = 8;
        gLevel.MINES = 12;
        countMines = 12;
        gBoard = buildBoard(size);
        renderBoard(gBoard);
    } else if (buttonPressed === 'Expert') {
        gLevel.SIZE = 12;
        size = 12
        gLevel.MINES = 30;
        countMines = 30;
        gBoard = buildBoard(size);
        renderBoard(gBoard);
    }
}


// Builds the board Set mines at random locations Call setMinesNegsCount() 
// Return the created board

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = createCell(i, j);
        }
    }
    gBoard = board;
    return board;
}

// A function that creates from any object cell

function createCell(i, j) {
    var cell = {
        i: i,
        j: j,
        valu: EMPTY,
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}

// Render the board as a <table> to the page

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var row = board[i][j].i;
            var col = board[i][j].j;
            // var cell = board[i][j].minesAroundCount;
            var className = 'cell' + row + '-' + col;
            strHTML += `<td onclick="cellClicked(this,${gBoard[i][j].i},${gBoard[i][j].j})" 
            class="${className}">
            
            </td>`;
        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// Called when a cell (td) is clicked

function cellClicked(elcell, i, j) {
    if (isFirstClicked) {
        addMines(gBoard, i, j);
        isFirstClicked = false;
    }
    var cell = gBoard[i][j];
    if(cell.isMine){
        gameOver()
    }
    if (!gInterval) {
        startTimer();
    }

    if (cell.isMine) {
        elcell.innerHTML = MINES;
    } else if (!cell.isMine) {
        console.log(!cell.isMine);

        elcell.innerHTML = cell.minesAroundCount;
    }

    // if (cell.isMine)renderCell(i, j,MINES);
    // if(!cell.isMine)renderCell(i, j,minesAroundCount);



}

function addMines(board, i, j) {
    var count = 0;
    while (count < gLevel.MINES) {
        var randomI = getRandomIntInclusive(0, gLevel.SIZE - 1)
        var randomj = getRandomIntInclusive(0, gLevel.SIZE - 1)
        if (randomI === i && randomj === j) continue;
        if (board[randomI][randomj].valu !== MINES) {
            board[randomI][randomj].valu = MINES;
            board[randomI][randomj].isMine = true;
            count++
        }

    }
    setMinesNegsCount(board);
}


// Count mines around each cell and set the cell's minesAroundCount.

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var countMinesNigs = countNeigsMines(board, i, j)
            var cell = board[i][j];
            cell.minesAroundCount = countMinesNigs;
            board[i][j].isShown = true;
        }
    }
    console.log(gBoard);

    return countMinesNigs;
}
// A function that counts neighbors mines

function countNeigsMines(board, idxI, idxJ) {
    var neigsMines = 0;
    for (var i = (idxI - 1); i <= (idxI + 1); i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = (idxJ - 1); j <= (idxJ + 1); j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === idxI && j === idxJ) continue;
            if (gBoard[i][j].isMine) neigsMines++;
        }
    }
    console.log('neigsMines', neigsMines);

    return neigsMines;
}

// Game ends when all mines are marked and all the other cells are shown/
 function checkGameOver(){


 }


// Functions for timer

function setTime() {
    ++gTotalSeconds;
    var elMinutes = document.querySelector('.minutes');
    var elSeconds = document.querySelector('.seconds');
    elSeconds.innerHTML = pad(gTotalSeconds % 60);
    elMinutes.innerHTML = pad(parseInt(gTotalSeconds / 60));
}

function pad(val) {
    var res = val + '';
    if (res.length < 2) {
        return '0' + res;
    } else {
        return res;
    }
}

function startTimer() {
    gInterval = setInterval(setTime, 1000);
}

function pauseTimer() {

    clearInterval(gInterval);
}

//To Do: in case of clicking on a cell do game over,expose all mines in the board
function gameOver(){
for(var i = 0;i<gBoard.length;i++){
    for(var j =0 ;j< gBoard[0].length;j++){
        if(gBoard[i][j].isMine){
            renderCell(i,j,gBoard[i][j].valu)
        }
    }
}
var elSmile = document.querySelector('.restartFace');
elSmile.innerHTML = LOSE;
pauseTimer();
}


// ------------------------------------
// Not working - I started over
// ------------------------------------

// / function renderBoard(board) {
    //     var strHTML = `<table border="0"><tbody>`
    //     for (var i = 0; i < board.length; i++) {
    //         strHTML += `<tr>`
    //         for (var j = 0; j < board[0].length; j++) {
    //             var cell = board[i][j].value
    //             var className = `cell cell-${i}-${j}`
    //             strHTML += `<td class="${className}" onmousedown="cellClicked(event, ${i}, ${j})"><span hidden>${cell}</span></td>`
    //         }
    //         strHTML += `</tr>`
    //     }
    //     strHTML += `</tbody></table>`
    //     var elGameBoard = document.querySelector('.game-board')
    //     elGameBoard.innerHTML = strHTML
    // }




    // function renderBoard() {
    //     var strHtml = '';
    //     for (var i = 0; i < gBoard.length; i++) {
    //         strHtml += '<tr>'
    //         for (var j = 0; j < gBoard[0].length; j++) {
    //             var cell = gBoard[i][j];
    //             var className = `cell-${i}-${j}`
    //             strHtml += 
    //             `<td class="${className}" 
    //               onclick="cellClicked(this, ${i}, ${j})">
    //                 ${cell}
    //             </td>`
    //         }
    //         strHtml += '</tr>'
    //     }
    //     document.querySelector('.board').innerHTML = strHtml;
    // }



    // 

// var cell = { id: 0, valu: EMPTY ,isShown: false,isMine: false, isMarked: false}
// board[i][j] = cell;
// if ((i === 1 && j === 1) || (i === 0 && j === 2)) {
    //     board[i][j] = gMines;
    // }
// uilds the board Set mines at random locations Call 
//     // setMinesNegsCount() Return the created board


//     function buildBoard(size, countMineS) {
//         var board = [];
//         for (var i = 0; i < size; i++) {
//             board[i] = [];
//             for (var j = 0; j < size; j++) {
//                 board[i][j] = EMPTY;
//             }
//         }
//         gBoard = board;
//         addMines(countMineS)

//         // setMinesNegsCount()
//     }
// }

// // Count mines around each cell and set the cell's minesAroundCount.


// function setMinesNegsCount(posI, posJ) {
//     for (var i = posI - 1; i <= posI + 1; i++) {
//         if (i < 0 || i >= gBoard.length) continue;
//         for (var j = posJ - 1; j <= posJ + 1; j++) {
//             if (j < 0 || j >= gBoard.length) continue;
//             if (i === posI && j === posJ) continue;
//             if (gBoard[i][j] !== MINES) gBoard[i][j]++;
//         }
//     }
// }

// // function getClassName(location) {
// //     var cellClass = 'cell-' + location.i + '-' + location.j;
// //     return cellClass;
// // }

// // Called when a cell (td) is clicked
// function cellClicked(elCell, posI,posJ) {
//     console.log();

//     if (gBoard[posI][posJ] == MINES) {
//         mines();

//     }

// }

// function addMines(countMines) {
//     var count = countMines
//     while (count > 0) {
//         var randomI = getRandomIntInclusive(1, gBoard.length - 1)
//         var randomj = getRandomIntInclusive(1, gBoard.length - 1)
//         var currMines = gBoard[randomI][randomj]
//         if (currMines === EMPTY) {
//             gBoard[randomI][randomj] = MINES;
//             count--
//             setMinesNegsCount(randomI, randomj);
//         }
//     }
//     renderBoard();
// }


// function mines() {
//     var mines = document.querySelectorAll('.mines');
//     for (var i = 0; i < mines.length; i++) {
//         mines[i].innerHTML = MINES;

//     }
// }

// // Called on right click to mark a cell (suspected to be a mine) Search the web 
// // (and implement) how to hide the context menu on right click

// function cellMarked(elCell) {

// }

// // Game ends when all mines are marked and all the other cells are shown

// function checkGameOver() {

// }

// // When user clicks a cell with no mines around, we need to open not only 
// // that cell, but also its neighbors. NOTE: start with a basic implementation 
// // that only opens the non-mine 1st degree neighbors BONUS: if you have the time 
// // later, try to work more like the real algorithm (see description at the Bonuses 
// // section below)

// function expandShown(board, elCell, i, j) {

// }
