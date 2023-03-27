import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  let isXNext = currentMove % 2 === 0;
  let currentBoard = history[currentMove];

  function handlePlay(nextBoard) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextBoard];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleSetIsPlaying() {
    if (!isPlaying) {
      setIsPlaying(!isPlaying);
    }

    if (isPlaying) {
      setIsPlaying(!isPlaying);
      handleReset();
      setIsPracticeMode(false);
    }
  }

  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function handlePractice() {
    setIsPracticeMode(!isPracticeMode);
    setIsPlaying(!isPlaying);
  }

  return (
    <div className={!isPracticeMode ? "App" : "App-practice"}>
      <h1 className="title">Tic-Tac-Toe</h1>
      <div className="board-container">
        <Board
          board={currentBoard}
          onPlay={handlePlay}
          isXNext={isXNext}
          isPlaying={isPlaying}
          onReset={handleReset}
          onSetIsPlaying={handleSetIsPlaying}
          onPractice={handlePractice}
          isPracticeMode={isPracticeMode}
        />
      </div>
      {isPracticeMode && (
        <div className="history-container">
          <div className="history">
            <h2>History</h2>
            <div className="history-buttons">
              {history.map((board, i) => {
                return i === 0 ? (
                  <button
                    className="history-button"
                    onClick={() => setCurrentMove(i)}
                  >
                    Clear Board
                  </button>
                ) : (
                  <button
                    className="history-button"
                    onClick={() => setCurrentMove(i)}
                  >
                    {"Go to move #" + i}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Board({
  board,
  onPlay,
  isXNext,
  isPlaying,
  onSetIsPlaying,
  onReset,
  onPractice,
  isPracticeMode,
}) {
  const hasWinner = calculateWinner(board);

  function handleClick(i) {
    if (hasWinner || board[i]) {
      return;
    }
    const nextBoard = [...board];
    if (isXNext) {
      nextBoard[i] = "X";
    }

    if (!isXNext) {
      nextBoard[i] = "O";
    }

    onPlay(nextBoard);
  }

  let squareClassName = "square";
  if (isXNext) {
    squareClassName += " square-x";
  }
  if (!isXNext) {
    squareClassName += " square-o";
  }
  if (hasWinner) {
    squareClassName = "square";
    return (
      <div className="board">
        {board.map((square, i) => {
          return (
            <div
              key={i}
              style={borderFix(i)}
              className={
                hasWinner.combination.has(i) && hasWinner.winner === "X"
                  ? "square square-x-pressed"
                  : hasWinner.combination.has(i) && hasWinner.winner === "O"
                  ? "square square-o-pressed"
                  : "square"
              }
              onClick={() => {
                handleClick(i);
              }}
            >
              {hasWinner.combination.has(i) ? square : ""}
            </div>
          );
        })}
        <div className="reset-container">
          <h2 className="draw">{hasWinner.winner + " Won!"}</h2>
          {!isPracticeMode ? (
            <>
              <button className="reset" onClick={onReset}>
                Reset Game
              </button>
              <button className="main-menu" onClick={onSetIsPlaying}>
                Main Menu
              </button>
            </>
          ) : (
            <button className="main-menu" onClick={onSetIsPlaying}>
              Main Menu
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!hasWinner && board.every((b) => b !== null)) {
    return (
      <>
        <div className="board">
          {board.map((square, i) => {
            return (
              <div
                key={i}
                style={borderFix(i)}
                className={
                  square === "X"
                    ? "square square-x-pressed"
                    : square === "O"
                    ? "square square-o-pressed"
                    : squareClassName
                }
                onClick={() => {
                  handleClick(i);
                }}
              >
                {square}
              </div>
            );
          })}
          <div className="reset-container">
            <h2 className="draw">Draw!</h2>
            {!isPracticeMode ? (
              <>
                <button className="reset" onClick={onReset}>
                  Reset Game
                </button>
                <button className="main-menu" onClick={onSetIsPlaying}>
                  Main Menu
                </button>
              </>
            ) : (
              <button className="main-menu" onClick={onSetIsPlaying}>
                Main Menu
              </button>
            )}
            {/* <button className="reset" onClick={onReset}>
              Reset Game
            </button>
            <button className="main-menu" onClick={onSetIsPlaying}>
              Main Menu
            </button> */}
          </div>
        </div>
      </>
    );
  }

  if (!isPlaying) {
    return (
      <div className="board-empty">
        <button className="start" onClick={onSetIsPlaying}>
          Start Game
        </button>
        <button className="practice" onClick={onPractice}>
          Practice Mode
        </button>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <>
        <div className="board">
          {board.map((square, i) => {
            return (
              <div
                key={i}
                style={borderFix(i)}
                className={
                  square === "X"
                    ? "square square-x-pressed"
                    : square === "O"
                    ? "square square-o-pressed"
                    : squareClassName
                }
                onClick={() => {
                  handleClick(i);
                }}
              >
                <span key={"" + square + i}>{square}</span>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { combination: new Set([a, b, c]), winner: board[a] };
    }
  }

  return null;
}

const borderFix = function (i) {
  return i === 0
    ? { borderTop: "none", borderLeft: "none" }
    : i === 1
    ? { borderTop: "none" }
    : i === 2
    ? { borderTop: "none", borderRight: "none" }
    : i === 3
    ? { borderLeft: "none" }
    : i === 4
    ? {}
    : i === 5
    ? { borderRight: "none" }
    : i === 6
    ? { borderBottom: "none", borderLeft: "none" }
    : i === 7
    ? { borderBottom: "none" }
    : { borderBottom: "none", borderRight: "none" };
};

export default App;

{
  /* <div
          className={
            board[0] === "X"
              ? "square square-x-pressed"
              : board[0] === "O"
              ? "square square-o-pressed"
              : squareClassName
          }
          onClick={(e) => {
            handleClick(0);
          }}
        >
          {board[0]}
        </div>
        <div
          className={
            board[1] === "X"
              ? "square square-x-pressed"
              : board[1] === "O"
              ? "square square-o-pressed"
              : squareClassName
          }
          onClick={(e) => {
            handleClick(1);
          }}
        >
          {board[1]}
        </div>
        <div
          className={
            board[2] === "X"
              ? "square square-x-pressed"
              : board[2] === "O"
              ? "square square-o-pressed"
              : squareClassName
          }
          onClick={(e) => {
            handleClick(2);
          }}
        >
          {board[2]}
        </div>
        <div
          className={
            board[3] === "X"
              ? "square square-x-pressed"
              : board[3] === "O"
              ? "square square-o-pressed"
              : squareClassName
          }
          onClick={(e) => {
            handleClick(3);
          }}
        >
          {board[3]}
        </div>
        <div
          className={
            board[4] === "X"
              ? "square square-x-pressed"
              : board[4] === "O"
              ? "square square-o-pressed"
              : squareClassName
          }
          onClick={(e) => {
            handleClick(4);
          }}
        >
          {board[4]}
        </div>
        <div
          className={
            board[5] === "X"
              ? "square square-x-pressed"
              : board[5] === "O"
              ? "square square-o-pressed"
              : squareClassName
          }
          onClick={(e) => {
            handleClick(5);
          }}
        >
          {board[5]}
        </div>
        <div
          className={
            board[6] === "X"
              ? "square square-x-pressed"
              : board[6] === "O"
              ? "square square-o-pressed"
              : squareClassName
          }
          onClick={(e) => {
            handleClick(6);
          }}
        >
          {board[6]}
        </div>
        <div
          className={
            board[7] === "X"
              ? "square square-x-pressed"
              : board[7] === "O"
              ? "square square-o-pressed"
              : squareClassName
          }
          onClick={(e) => {
            handleClick(7);
          }}
        >
          {board[7]}
        </div>
        <div
          className={
            board[8] === "X"
              ? "square square-x-pressed"
              : board[8] === "O"
              ? "square square-o-pressed"
              : squareClassName
          }
          onClick={(e) => {
            handleClick(8);
          }}
        >
          {board[8]}
        </div> */
}
