'use strict'

//Mine-sweeper game

let gBoard;

let gLevel = {
    SIZE: 4,
    MINES: 2,
};

let gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
function onInit() {
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
    gGame.isOn = true;
    console.log('Enjoy!');
}

function buildBoard(SIZE) {
    const board = [];

    for (var i = 0; i < SIZE; i++) {
        board[i] = []
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 4,
                isRevealed: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    board[1][2].isMine = true;
    board[2][3].isMine = true;

    return board;
}

function renderBoard(board) {
    let strHTML = '<table><tbody>';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j];
            const cellContent = cell.isMine ? '💣' : ' ';
            strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})"oncontextmenu="onCellMarked(this, ${i}, ${j})">${cellContent}</td>`;

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    document.querySelector('.board-container').innerHTML = strHTML;
}

function setMinesNegsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNegs(i, j, board);
        }
    }
}

function countNegs(rowIdx, colIdx, board) {
    let count = 0;
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i == rowIdx && j == colIdx) continue;
            if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) continue;
            if (board[i][j].isMine) count++;

        }
    }
    return count;
}

function onCellClicked(elCell, i, j) {
    const cell = gboard[i][j];
    if (cell.isMarked || cell.isRevealed) return;
    cell.isRevealed = true;
    gGame.revealedCount++;
    if (cell.isMine) {
        elCell.innerText = '💣';
        checkGameOver();
    } else {
        elCell.innerText = cell.minesAroundCount || ' ';
    }
}


function onCellMarked(elCell, i, j) {
    Event.preventDefault();
    const cell = gboard[i][j];
    if (cell.isRevealed) return;
    cell.isMarked = !cell.isMarked;
    elCell.innerText = cell.isMarked ? '🚩' : ' ';
    if (cell.isMarked) gGame.markedCount++;
    else gGame.markedCount--;
}

function expandReveal(board, elCell, i, j) {

}

function checkGameOver() {

}