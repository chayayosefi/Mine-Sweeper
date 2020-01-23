'use strict';

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function renderCell(i,j, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${i}-${j}`);
  elCell.innerHTML = value;
}

// function renderCell(elCell, row, col) {
//   var cell = gBoard[row][col];

//   if (cell.isMine) {
//     elCell.innerText = MINES;
//   }
//   else (!cell.isMine)
//     elCell.innerText = cell.minesAroundCount;
  
// }