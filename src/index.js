import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

function Restart(props) {
	return (
		<button className="restart" onClick={props.onRestart}>Начать заново</button>
	);
}

// ajax request
function request() {
	const url = 'https://78.155.218.226:8000/';
	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		req.open('GET', url);
		req.onload = function() {
			if (req.status === 200) {
				resolve(req.response);
			} else {
				reject(Error(req.statusText));
			}
		};
		req.onerror = function() {
			reject(Error('Network error!'))
		};
		req.send();
	});
}
//

class Board extends React.Component {
	constructor() {
		super();
		this.state = {
			squares: Array(9).fill(null),
			xIsNext: true
		};
	}
	handleClick(i) {
		const squares = this.state.squares.slice();
		if (calculateWinner(squares)[0] || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			squares: squares,
			xIsNext: !this.state.xIsNext
		});
	}
	newGame() {
		this.setState({
			squares: Array(9).fill(null),
			xIsNext: true
		});
	}
	renderSquare(i) {
		return (
			<Square
				value={this.state.squares[i]}
				onClick={() => this.handleClick(i)}
			/>
		);
	}
	renderRestart() {
		const winner = calculateWinner(this.state.squares)[0];
		const noNulls = detectNulls(this.state.squares);
		if(winner || noNulls) {
			return (
				<Restart onRestart={() => this.newGame()} />
			);
		}
	}
	renderWinLine() {
		const winner = calculateWinner(this.state.squares)[0];
		if (winner) {
			const [x1, y1, x2, y2] = calculateWinner(this.state.squares)[1];
			return (
				<svg width="320" height="320">
					<line
						x1={x1}
						y1={y1}
						x2={x2}
						y2={y2}
						stroke="#f00"
						strokeWidth="8"
						strokeLinecap="round"
					/>
				</svg>
			);
		}
	}
	render() {
		let status;
		request().then(function(response) {
			console.log(response);
		}).catch(function(err) {
			console.log('Error: ', err);
		});
		const winner = calculateWinner(this.state.squares)[0];
		const noNulls = detectNulls(this.state.squares);
		if (winner) {
			status = 'Победитель: игрок ' + winner;
		} else if(noNulls) {
			status = 'Ничья!';
		} else {
			status = 'Ход игрока ' + (this.state.xIsNext ? 'X' : 'O');
		}
		return (
			<div>
				<div className="status">{status}</div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
				{this.renderWinLine()}
				{this.renderRestart()}
			</div>
		);
	}
}

class Game extends React.Component {
	render() {
		return (
			<div className="game">
				<div className="game-board">
					<Board />
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	const b = 9; // border
	const p = 5; // padding
	const s = 51; // 1/2 of square size
	const l = 320; // svg size
	const coordinates = [
		[p, (b+s), (l-p), (b+s)],
		[p, (b+3*s), (l-p), (b+3*s)],
		[p, (b+5*s), (l-p), (b+5*s)],
		[(b+s), p, (b+s), (l-p)],
		[(b+3*s), p, (b+3*s), (l-p)],
		[(b+5*s), p, (b+5*s), (l-p)],
		[p, p, (l-p), (l-p)],
		[(l-p), p, p, (l-p)]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a], coordinates[i]];
		}
	}
	return [null, null];
}

function detectNulls(squares) {
	return squares.every(e => e !== null);
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
