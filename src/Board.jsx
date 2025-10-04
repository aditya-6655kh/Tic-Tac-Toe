import React from "react";
import SquareBox from "./SquareBox";
import "./Board.css";
import { useState, useEffect } from "react";

const Board = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // true -> X , false -> O
  const [startPlayer, setStartPlayer] = useState(null); // null -> no player , 'X' -> X , 'O' -> O

  const [seriesLen, setSeriesLen] = useState(1); // to keep track of series length
  const [scores, setScores] = useState({ X: 0, O: 0 }); // to keep track of scores
  const [currGame, setCurrGame] = useState(1); // to keep track of current game in series
  const [seriesOver, setSeriesOver] = useState(false); // to check if series is over

  const [player, setPlayer] = useState({ X: "Player 1", O: "Player 2" });

  const winner = calculateWinner(squares);
  const targetScore = Math.ceil(seriesLen / 2); // score needed to win the series

  // check for winner and update scores
  useEffect(() => {
    if (seriesOver) return;
    if (winner) {
      if (winner === "X") {
        setScores((prev) => ({ ...prev, X: prev.X + 1 }));
      }
      if (winner === "O") {
        setScores((prev) => ({ ...prev, O: prev.O + 1 }));
      }
      setTimeout(() => {
        setSquares(Array(9).fill(null));
        setCurrGame((prev) => prev + 1);
        setXIsNext(startPlayer === "X" ? true : false);
      }, 1000);
    } else if (!squares.includes(null) && !winner) {
      setTimeout(() => {
        setSquares(Array(9).fill(null));
        setCurrGame((prev) => prev + 1);
        setXIsNext(startPlayer === "X" ? true : false);
      }, 1000);
    }
  }, [winner, seriesOver, startPlayer, squares]);

  // check if series is over
  useEffect(() => {
    if (seriesOver) return;
    if (scores.X === targetScore || scores.O === targetScore) {
      setSeriesOver(true);
      alert(
        `Series Over! ${
          scores.X === targetScore ? player.X : player.O
        } wins the series!`
      );
    }
  }, [scores, targetScore, seriesOver, player]);

  function handleClick(i) {
    if (squares[i] || winner || seriesOver) {
      return;
    }

    const nextSq = squares.slice();

    nextSq[i] = xIsNext ? "X" : "O";
    setSquares(nextSq);
    setXIsNext(!xIsNext);
  }

  function resetBoard() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function resetSeries() {
    setScores({ X: 0, O: 0 });
    setCurrGame(1);
    setSeriesOver(false);
    // setSeriesLen(1);
    setStartPlayer(null);
    resetBoard();
  }

  if (!startPlayer) {
    return (
      <div className="start-player">
        <div className="player-name">
          <h2>Enter Player Names :</h2>
          <input
            type="text"
            placeholder="Player 1 (X)"
            onChange={(e) =>
              setPlayer((prev) => ({ ...prev, X: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Player 2 (O)"
            onChange={(e) =>
              setPlayer((prev) => ({ ...prev, O: e.target.value }))
            }
          />
        </div>
        <div className="series-selector">
          <h2>Select Series Length : </h2>
          <select
            value={seriesLen}
            onChange={(e) => setSeriesLen(Number(e.target.value))}
          >
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={7}>7</option>
          </select>
        </div>
        <h2>Choose Starting Player : </h2>
        <button
          onClick={() => {
            setStartPlayer("X");
            setXIsNext(true);
          }}
        >
          Start with {player.X} X
        </button>
        <button
          onClick={() => {
            setStartPlayer("O");
            setXIsNext(false);
          }}
        >
          Start with {player.O} O
        </button>
      </div>
    );
  }

  let status;
  //Set the status message based on the result
  if (seriesOver) {
    status = `Series Over! ${
      scores.X === targetScore ? player.X : player.O
    } wins the series!`;
  } else if (winner === "X") {
    status = "Winner: " + player.X + " (X)";
  } else if (winner === "O") {
    status = "Winner: " + player.O + " (O)";
  } else if (!squares.includes(null)) {
    status = "Draw!";
  } else {
    status =
      "Next player: " +
      (xIsNext ? player.X : player.O) +
      " (" +
      (xIsNext ? "X" : "O") +
      ")";
  }

  function calculateWinner(squares) {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null; // no winner yet
  }

  return (
    <div className="game">
      <div className="status" style={{ color: winner ? "#28a745" : "#333" }}>
        <h3>{status}</h3>
      </div>

      <div className="scoreboard">
        <p>Series: Best of {seriesLen}</p>
        <p>
          Game {Math.min(currGame, seriesLen)} / {seriesLen}
        </p>
        <p>
          {player.X} Wins: {scores.X} | {player.O} Wins: {scores.O}
        </p>
      </div>

      <div className="Board">
        <div className="row">
          <SquareBox value={squares[0]} onClick={() => handleClick(0)} />
          <SquareBox value={squares[1]} onClick={() => handleClick(1)} />
          <SquareBox value={squares[2]} onClick={() => handleClick(2)} />
        </div>
        <div className="row">
          <SquareBox value={squares[3]} onClick={() => handleClick(3)} />
          <SquareBox value={squares[4]} onClick={() => handleClick(4)} />
          <SquareBox value={squares[5]} onClick={() => handleClick(5)} />
        </div>
        <div className="row">
          <SquareBox value={squares[6]} onClick={() => handleClick(6)} />
          <SquareBox value={squares[7]} onClick={() => handleClick(7)} />
          <SquareBox value={squares[8]} onClick={() => handleClick(8)} />
        </div>
      </div>
      <div className="controls">
        <button onClick={resetBoard}>Restart</button>
        <button onClick={resetSeries}>Reset Series</button>
      </div>
    </div>
  );
};

export default Board;
