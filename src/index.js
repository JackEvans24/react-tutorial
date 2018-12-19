import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
        <button className="square" style={{ backgroundColor: props.backgroundColor }} onClick={props.onClick}>
            {props.value}
        </button>
    )
}
  
class Board extends React.Component {
    renderSquare(i, isWinningSquare) {
        var backgroundColor = (isWinningSquare && isWinningSquare === true) ? '#00ff00' : '#ffffff'
        return (
            <Square
                backgroundColor={ backgroundColor }
                key={ i }
                value={ this.props.squares[i] }
                onClick={ () => this.props.onClick(i) }
            />
        );
    }
    
    render() {
        var elements = [];

        for (let i = 0; i < 3; i++) {
            var innerElements = []    ;

            for (let j = 0; j < 3; j++) {
                innerElements.push(this.renderSquare((j * 3) + i, (this.props.winningSquares && this.props.winningSquares.indexOf(i) > -1)))
            }

            elements.push(<div key={i} className="board-row">{innerElements}</div>)
        }

        return (
            <div>
                {elements}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                move: '',
                winningSquares: Array(3).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }
    
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()
    
        if (calculateWinner(squares) || squares[i])
            return        
        squares[i] = this.state.xIsNext ? 'X' : 'O'

        let moveText = getMoveText(i)    
        this.setState({
            history: history.concat([{
                squares: squares,
                move: moveText
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const result = calculateWinner(current.squares)

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start'
            const style = move === this.state.stepNumber ? 'bold' : 'normal'
            return (
                <li key={move}>
                    <button
                        style={{fontWeight: style}}
                        onClick={ () => this.jumpTo(move) }
                    >
                        {desc}
                    </button>
                    <span>{step.move}</span>
                </li>
            )
        })
        
        let status
        if (result) {
            status = 'Winner: ' + result.winner
            current.winningSquares = result.squares
        } else if (this.state.stepNumber === 9) {
            status = 'No winners this time'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        winningSquares={current.winningSquares}
                        onClick={ (i) => this.handleClick(i) }
                    />

                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
    ]

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { squares: lines[i], winner: squares[a] };
        }
    }

    return null;
}

function getMoveText(i) {
    let move = '(' + ((i % 3) + 1).toString()
    if (i < 3)
        return move + ', 3)'
    else if (i < 6)
        return move + ', 2)'
    else
        return move + ', 1)'
}