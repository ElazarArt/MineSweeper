'use strict'

let gBoard;

let gLevel = { SIZE: 4, MINES: 2, };

let gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    isFirstClick: true
};

let gTimerInterval;

function onInit() {
    clearInterval(gTimerInterval);
    gBoard = buildBoard(gLevel.SIZE);
    gGame = {
        isOn: true,
        revealedCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        isFirstClick: true
    };

    updateUI();
    renderBoard(gBoard);
    updateSmiley('😃');
    gTimerInterval = setInterval(updateTimer, 1000)
    console.log('Enjoy!');
}

function buildBoard(SIZE) {
    const board = [];
    for (let i = 0; i < SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false,
            };
        }
    }
    return board;
}

function placeMines(board, firstClickRow, firstClickCol) {
    let minesPlaced = 0;
    while (minesPlaced < gLevel.MINES) {
        const row = Math.floor(Math.random() * board.length);
        const col = Math.floor(Math.random() * board[0].length);

        if (!board[row][col].isMine &&
            !(row === firstClickRow &&
                col === firstClickCol)) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
}

function setLevel(size, mines) {
    gLevel.SIZE = size;
    gLevel.MINES = mines;

    document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
    const buttons = document.querySelectorAll('.level-btn');
    buttons.forEach(btn => {
        const text = btn.textContent;
        if ((size === 4 && text.includes('Beginner')) ||
            (size === 8 && text.includes('Medium')) ||
            (size === 12 && text.includes('Expert'))) {
            btn.classList.add('active');
        }
    });
    onInit();
}

function renderBoard(board) {
    let strHTML = '<table><tbody>';
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j];
            let cellContent = '';
            let cellClass = `cell-${i}-${j}`;

            if (cell.isMarked) {
                cellContent = '🚩';
            } else if (cell.isRevealed) {
                if (cell.isMine) {
                    cellContent = '💣';
                    cellClass += ' mine';
                } else {
                    cellContent = cell.minesAroundCount || ' ';
                    if (cell.minesAroundCount > 0) {
                        cellClass += ` num-${cell.minesAroundCount}`;
                    }
                }
                cellClass += ' revealed';
            }
            strHTML += `<td class="${cellClass}" 
                onclick="onCellClicked(${i}, ${j})"
                oncontextmenu="onCellMarked(event, ${i}, ${j})">${cellContent}</td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    document.querySelector('.board-container').innerHTML = strHTML;
}

function setMinesNegsCount(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countNegs(i, j, board);
            }
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

function onCellClicked(i, j) {
    const cell = gBoard[i][j];
    if (!gGame.isOn || cell.isMarked || cell.isRevealed) return;

    if (gGame.isFirstClick) {
        placeMines(gBoard, i, j);
        setMinesNegsCount(gBoard);
        gGame.isFirstClick = false;
    }

    cell.isRevealed = true;
    gGame.revealedCount++;

    if (cell.isMine) {
        gGame.lives--;
        updateUI();

        if (gGame.lives === 0) {
            updateSmiley('😭')
            gameOver(false);
        } else {
            updateSmiley('🤕')
            setTimeout(() => updateSmiley('😃'), 1000);
            cell.isRevealed = false;
            gGame.revealedCount--;
        }
    } else {
        if (cell.minesAroundCount === 0) {
            expandReveal(gBoard, i, j);
        }
        checkGameOver();
    }
    renderBoard(gBoard);
}


function onCellMarked(ev, i, j) {
    ev.preventDefault();
    const cell = gBoard[i][j];

    if (!gGame.isOn || cell.isRevealed) return;

    cell.isMarked = !cell.isMarked;
    gGame.markedCount += cell.isMarked ? 1 : -1;

    updateUI();
    renderBoard(gBoard);
    checkGameOver();
}

function expandReveal(board, rowIdx, colIdx) {
    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) continue;
            if (i === rowIdx && j === colIdx) continue;

            const cell = board[i][j];
            if (!cell.isRevealed && !cell.isMarked && !cell.isMine) {
                cell.isRevealed = true;
                gGame.revealedCount++;

                if (cell.minesAroundCount === 0) {
                    expandReveal(board, i, j);
                }
            }
        }
    }
}

function checkGameOver() {
    const totalCells = gLevel.SIZE * gLevel.SIZE;
    const totalSafeCells = totalCells - gLevel.MINES;

    if (gGame.revealedCount === totalSafeCells) {
        gameOver(true);
    }
}

function gameOver(isWin) {
    gGame.isOn = false;
    clearInterval(gTimerInterval);

    if (isWin) {
        updateSmiley('😎');
        setTimeout(() => alert('👑 Congratulations! You Won! 🏆'), 100)
    } else {
        updateSmiley('😭');
        revealAllMines();
        setTimeout(() => alert('❌ Game Over ! ❌'), 100)
    }
}

function revealAllMines() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isRevealed = true;
            }
        }
    }
    renderBoard(gBoard);
}

function updateUI() {
    document.getElementById('timer').textContent = gGame.secsPassed;
    document.getElementById('mines-count').textContent = gLevel.MINES;
    document.getElementById('flags-count').textContent = gGame.markedCount;
    document.getElementById('lives-count').textContent = gGame.lives;
}

function updateTimer() {
    if (gGame.isOn) {
        gGame.secsPassed++;
        updateUI();
    }
}

function updateSmiley(emoji) {
    document.querySelector('.smiley-btn').textContent = emoji;
}

window.onload = function () {
    onInit();
};
