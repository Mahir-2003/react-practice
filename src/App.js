import { useState } from 'react';

function Square( {value, onSquareClick} ) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const playerX = currentMove % 2 === 0;

  function handlePlay( newSquares) {
    //only want to keep history up to the current point, not the entire history (i.e: in the future)
    const nextHistory = [...history.slice(0, currentMove + 1), newSquares]; 
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1); //each time a move is made, currentMove is updated to point to the latest history entry
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map(( squares, move ) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = `Go to game start`;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}> {description} </button> 
      </li>
    );
  });

  return (
    <div className = "game">
      <div className = "game-board">
        <Board playerX = {playerX} squares = {currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board( {playerX, squares, onPlay} ) {
  const winner = calculateWinner(squares);

  let status;
  
  if (winner) {
    status = <h1> Winner: {winner} </h1>;
  } else {
    status = <h1> Next player: {(playerX ? "X" : "O")} </h1>;
  }


  function handleClick( index ) {
    const newSquares = squares.slice(); // copy of the squares array for storing new board

    if (newSquares[index] !== null || calculateWinner(squares)) return; // dont do anything if square is already filled
    if (playerX) {
      newSquares[index] = 'X';
    } else {
      newSquares[index] = 'O';
    }
    onPlay(newSquares);
  }

  return (
    <>
      <div className="status">{status}</div> {/**current status displayed above board >*/}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], // winning combinations
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        document.body.style.backgroundColor = squares[a] === 'X' ? 'green' : 'darkred';
        return squares[a];
      }
    }
    return null;
  }
}
