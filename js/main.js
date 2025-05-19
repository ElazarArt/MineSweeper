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
    board[3][1].isMine = true;

    return board;
}

function renderBoard(board) {
    let strHTML = '<table><tbody>';

    for (var i = 0; i < board.length; i++){
        strHTML += '<tr>';
        for (var j = 0; j < board[i].length; j++){
            const cell = board [i][j];
            const cellContent = cell.isMine ? '*' : ' ';
            strHTML += `<td>${cellContent}</td>`;
        }
        strHTML += '</tr>'
        }
        strHTML += '</tbody></table>'

        document.querySelector('.board-container').innerHTML = strHTML;
    }

function onCellClicked(){
    
}