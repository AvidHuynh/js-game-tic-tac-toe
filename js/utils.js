import { GAME_STATUS, CELL_VALUE, TURN } from "./constants.js";
export function checkGameStatus(cellValues) {
  if (!Array.isArray(cellValues) || cellValues.length !== 9) {
    throw new Error("Invalid value");
  }
  // win
  const checkWinList = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];
  // find the winning set in the list
  const winSetIndex = checkWinList.findIndex((set) => {
    const firt = cellValues[set[0]];
    const second = cellValues[set[1]];
    const third = cellValues[set[2]];
    return firt != "" && firt === second && second === third;
  });
  if (winSetIndex >= 0) {
    // VD: [0,3,6] -> [0]/[1]/[2] have mean index of value of the firt/second/third
    const winValueIndex = checkWinList[winSetIndex][1];
    // get value X or O of winValueIndex
    const winValue = cellValues[winValueIndex];
    return {
      status:
        winValue === CELL_VALUE.CIRCLE ? GAME_STATUS.O_WIN : GAME_STATUS.X_WIN,
      // index of position array win in checkWinList
      // VD: [0,3,6]
      winPositions: checkWinList[winSetIndex],
    };
  }
  // end
  // playing
  const isEndGame = cellValues.filter((x) => x === "").length === 0;
  return {
    status: isEndGame ? GAME_STATUS.ENDED : GAME_STATUS.PLAYING,
    winPositions: [],
  };
}
