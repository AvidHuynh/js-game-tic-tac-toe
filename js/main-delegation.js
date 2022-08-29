import {
  getCellElementList,
  getCurrentTurnElement,
  getCellElementAtIdx,
  getGameStatusElement,
  getReplayButton,
  getCellListElement,
} from "./selectors.js";

import { TURN, GAME_STATUS, CELL_VALUE } from "./constants.js";
import { checkGameStatus } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

// sub function
function changeCurrentTurn() {
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
  // update turn on DOM element
  const getCurrentTurn = getCurrentTurnElement();
  if (getCurrentTurn) {
    getCurrentTurn.classList.remove(TURN.CROSS, TURN.CIRCLE);
    getCurrentTurn.classList.add(currentTurn);
  }
}
function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;
  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}
function showReplayButton() {
  const replayButton = getReplayButton();
  if (replayButton) replayButton.classList.add("show");
}
function hideReplayButton() {
  const replayButton = getReplayButton();
  if (replayButton) replayButton.classList.remove("show");
}
function hightlightWinCell(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error("Invalid win positions");
  }
  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    if (cell) cell.classList.add("win");
  }
}
// main function
function handleCellClick(cell, index) {
  const isClick =
    cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);
  const endGame = gameStatus !== GAME_STATUS.PLAYING;
  if (isClick || endGame) return;
  // set selected cell
  cell.classList.add(currentTurn);
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;
  // toogel turn
  // winPosition is an array
  changeCurrentTurn();
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      // update game status
      // show replay button
      updateGameStatus(game.status);
      showReplayButton();
      break;
    }
    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN: {
      // update game status
      // show replay button
      // highlight win cells
      updateGameStatus(game.status);
      showReplayButton();
      hightlightWinCell(game.winPositions);
      break;
    }
    default:
      // playing
      updateGameStatus(game.status);
  }
}
function resetGame() {
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => "");
  updateGameStatus(GAME_STATUS.PLAYING);
  const getCurrentTurn = getCurrentTurnElement();
  if (getCurrentTurn) {
    getCurrentTurn.classList.remove(TURN.CROSS, TURN.CIRCLE);
    getCurrentTurn.classList.add(TURN.CROSS);
  }
  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = "";
  }
  hideReplayButton();
}
function initCellElementList() {
  const liList = getCellElementList();
  liList.forEach((cell, index) => {
    cell.dataset.idx = index;
  });
  // attach event click for ul element
  const ulElement = getCellListElement();
  if (ulElement) {
    ulElement.addEventListener("click", (event) => {
      if (event.target.tagName !== "LI") return;

      const index = Number.parseInt(event.target.dataset.idx);
      handleCellClick(event.target, index);
    });
  }
}
function initResetListButton() {
  const resetButton = getReplayButton();
  if (resetButton) resetButton.addEventListener("click", resetGame);
}

(() => {
  initCellElementList();
  initResetListButton();
})();

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
