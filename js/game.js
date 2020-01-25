'use strict';
const FLAG = '🚩';
var NORMAL = '😀';
var LOSE = '😧';
var WIN = '😎';
var HINT = '💡';
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
 
var hint = {
    sumHint: 3,
    isHintClick: false
}
 
var gGame = {
    isPause: false,
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
 
// This is called when page loads
function resetVars() {
    gGame.isOn = true;
    document.querySelector('.Game-over-msg').style = "display: none";
    document.querySelector('.victorious-msg').style = "display: none";
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
    resetVars();
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
        size = 12;
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
        id: `cell-${i}-${j}`,
        i: i,
        j: j,
        // valu: EMPTY,
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}
 
document.oncontextmenu = function () {
    return false;
}
 
// Render the board as a <table> to the page
function onRightClick(i, j) {
 
    if (gGame.isPause || !gGame.isOn) {
        return;
    }
 
    if (isFirstClicked) {
        addMines(gBoard, i, j);
        isFirstClicked = false;
    }
 
    var cell = gBoard[i][j];
 
    if (cell.isShown) {
        return;
    }
 
    cell.isMarked = cell.isMarked ? false : true;
 
 
    renderCell(i, j, cell.isMarked ? FLAG : EMPTY);
 
    if (cell.isMarked) {
        checkAndhandleVictory(gBoard);
    }
}
 
function renderBoard(board) {
    var strHTML = '';
 
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
 
        for (var j = 0; j < board[0].length; j++) {
            var call = board[i][j];
 
            strHTML += `<td onclick="cellClicked(${call.i}, ${call.j})"; onContextMenu="onRightClick(${call.i}, ${call.j})"
            class="${call.id}">
             
            </td>`;
        }
        strHTML += '</tr>'
    }
 
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}
 
// Called when a cell (td) is clicked
function showHint(board, idxI, idxJ) {
 
    --hint.sumHint;
 
    var cellHints = [];
    for (var i = (idxI - 1); i <= (idxI + 1); i++) {
 
        if (i < 0 || i >= board.length) continue;
 
        for (var j = (idxJ - 1); j <= (idxJ + 1); j++) {
            if (j < 0 || j >= board.length) continue;
 
            var cell = board[i][j];
            if (cell.isShown || cell.isMarked) {
                continue;
            }
 
            var value = cell.isMine ? MINES : cell.minesAroundCount;
            renderCell(i, j, value);
            cellHints.push(board[i][j]);
        }
    }
 
    setTimeout(() => {
         
        for (var cell of cellHints) {
            renderCell(cell.i, cell.j, EMPTY);
        }
 
        gGame.isPause = false;
        hint.isHintClick = false;
    }, 3000);
 
}
 
function cellClicked(i, j) {
 
    if (isFirstClicked) {
        startTimer();
        addMines(gBoard, i, j);
        isFirstClicked = false;
    }
 
    var cell = gBoard[i][j];
 
    if (cell.isMarked || cell.isShown || !gGame.isOn) {
        return;
    }
 
    if (hint.isHintClick && hint.sumHint) {
        showHint(gBoard, i, j);
    }
 
    if (gGame.isPause) {
        return;
    }
 
    cell.isShown = true;
    if (cell.isMine) {
        renderCell(i, j, MINES);
        gameOver();
        return;
    }
 
    renderCell(i, j, cell.minesAroundCount);
 
    if (cell.minesAroundCount === 0) {
 
        expandShown(gBoard, i, j);
    }
 
    checkAndhandleVictory(gBoard);
}
 
// When user clicks a cell with no mines around, we need to open not only that cell,
//  but also its neighbors.NOTE: start with a basic implementation that only opens
//  the non-mine 1st degree neighbors
 
function expandShown(board, posI, posJ) {
 
    for (var i = posI - 1; i <= posI + 1; i++) {
 
        if (i < 0 || i >= board.length) {
            continue;
        }
 
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (i === posI && j === posJ) {
                continue;
            }
 
            if (j < 0 || j >= board.length) {
                continue;
            }
 
            if (board[i][j].isShown) {
                continue;
            }
 
            board[i][j].isShown = true;
            var minesAroundCount = board[i][j].minesAroundCount;
            renderCell(i, j, minesAroundCount);
            if (minesAroundCount === 0) {
                expandShown(board, i, j)
            }
        }
    }
}
 
// A function that adds mines
 
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
            // board[i][j].isShown = true;
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
// A function that checks victory
 
function checkAndhandleVictory(board) {
 
    for (var i = 0; i < board.length; i++) {
 
        for (var j = 0; j < board[0].length; j++) {
            var call = board[i][j];
 
            if (call.isMarked && call.isMine) {
                continue;
            }
 
            if (call.isShown) {
                continue;
            }
 
            return false;
        }
    }
    pauseTimer();
    document.querySelector('.restartFace').innerHTML = WIN;
    document.querySelector('.victorious-msg').style = "display: block";
}
 
// Function that detects where there is a bomb-free cell for 3 seconds
 
function hintButtonClick(hintNumber) {
 
    if (gGame.isPause || !gGame.isOn) {
        return
    }
    document.querySelector(`.hint-${hintNumber}`).style = "display: none";
    hint.isHintClick = true;
    gGame.isPause = true;
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
 
function gameOver() {
 
    gGame.isOn = false;
 
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                renderCell(i, j, gBoard[i][j].valu);
            }
        }
    }
    var elSmile = document.querySelector('.restartFace');
    elSmile.innerHTML = LOSE;
    pauseTimer();
    document.querySelector('.Game-over-msg').style = "display: block";
}