import React from 'react';
import Board from './board';
import { ColorSelector, ColorEnum } from './color-selector';
import Banner from './banner';
import { AiPlayer } from './ai';

const AnswerEnum = {
    WRONG: 0,
    COLOR: 1,
    COLORANDPLACE: 2
}

export const GameState = {
    ONGOING: 0,
    GAMEOVER: 1,
    WON: 2
}

const intialState = {
    pegs: [
        { color: ColorEnum.RED, isSelected: true },
        { color: ColorEnum.GREEN, isSelected: false },
        { color: ColorEnum.BLUE, isSelected: false },
        { color: ColorEnum.YELLOW, isSelected: false },
        { color: ColorEnum.ORANGE, isSelected: false },
        { color: ColorEnum.PURPLE, isSelected: false },
    ],
    // On each row first 4 positions are for the player, last 4 is result
    rows: Array(12).fill(0).map(x => Array(8).fill(x)),
    currentRowIndex: 0,
    gameState: GameState.ONGOING
};

export class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = intialState;
        this.state.answer = this.generateAnswer();
    }

    makeAiTurn = (flag) => {
        if (this.state.gameState !== GameState.ONGOING) {
            return;
        }
        if (!flag) {
            let move = this.ai.makeMove();
            for (let i = 0; i < move.length; i++) {
                setTimeout(() => this.makeAiAction(move, i), i * 250);
            }
            setTimeout(() => {
                this.onDoneRowClick(this.state.currentRowIndex);
                this.makeAiTurn(true);
            }, 2500);
        } else {
            // Handle a row that is done. calculate new move.
            let previousRow = this.state.rows[this.state.currentRowIndex - 1];
            this.ai.removeMoves(previousRow.slice());
            this.makeAiTurn(false);
        }
    }

    makeAiAction = (move, i) => {
        let color = Object.assign({}, { color: move[i] });
        this.onSelectColorClick(color);
        this.onPositionPegClick(this.state.currentRowIndex, i);
    }

    newGame = () => {
        let newAnswer = this.generateAnswer()
        this.setState({ ...intialState, answer: newAnswer });
    }

    newAiGame = () => {
        let newAnswer = this.generateAnswer()
        this.setState({ ...intialState, answer: newAnswer }, () => {
            this.ai = new AiPlayer();
            this.makeAiTurn(false);
        });
    }

    generateAnswer = () => {
        const array = Array(4).fill(0);
        const numberOfColors = Object.keys(ColorEnum).length - 1;
        for (let i = 0; i < array.length; i++) {
            const number = Math.floor(Math.random() * numberOfColors) + 1;
            array[i] = number;
        }

        return array;
    };

    onSelectColorClick = (selected) => {
        const newPegs = this.state.pegs.map(item => {
            if (item.color === selected.color) {
                item.isSelected = true;
            } else {
                item.isSelected = false;
            }
            return item;
        });
        this.setState(prevState => ({
            ...prevState,
            pegs: newPegs
        }));
    }

    onPositionPegClick = (rowIndex, position) => {
        if (this.state.currentRowIndex !== rowIndex ||
            this.state.gameState !== GameState.ONGOING)
            return;

        const selectedColor = this.state.pegs.find(item => item.isSelected);
        const newRows = this.state.rows.map((row) => {
            return row.slice();
        });

        if (!selectedColor) {
            newRows[rowIndex][position] = 0;
            this.setState(prevState => ({
                ...prevState,
                rows: newRows
            }));
            return;
        }

        if (newRows[rowIndex][position] === selectedColor.color) {
            newRows[rowIndex][position] = 0;
        } else {
            newRows[rowIndex][position] = selectedColor.color;
        }

        this.setState(prevState => ({
            ...prevState,
            rows: newRows
        }));
    }

    hasRowBeenAnswered = (currentRow) => {
        const result = currentRow.find((value, index) => {
            return value === 0 && index < 4;
        });
        return (result === undefined);
    }

    calculateResult = (currentRow) => {
        let copyOfAnswers = this.state.answer.slice();
        console.log(copyOfAnswers);
        let copyOfRow = currentRow.slice();
        let countArray = [];
        // check position and color;
        for (let i = 0; i < copyOfAnswers.length; i++) {
            if (copyOfRow[i] === copyOfAnswers[i]) {
                countArray.push(AnswerEnum.COLORANDPLACE);
                copyOfAnswers[i] = copyOfRow[i] = 0;
            }
        }

        // check if any more colors exists
        for (let i = 0; i < copyOfRow.length; i++) {
            if (copyOfRow[i] !== 0) {
                for (let j = 0; j < copyOfAnswers.length; j++) {
                    if (copyOfRow[i] === copyOfAnswers[j] && copyOfAnswers[j] !== 0) {
                        countArray.push(AnswerEnum.COLOR);
                        copyOfAnswers[j] = copyOfRow[i] = 0;
                    }
                }
            }
        }

        countArray = this.shuffle(countArray);
        let startPosition = 4;
        countArray.forEach(number => {
            currentRow[startPosition] = number;
            startPosition++;
        });

        if (countArray.length === 4 && countArray.every((value) => value === 2)) {
            return GameState.WON;
        }
        return GameState.ONGOING;
    }

    shuffle = (arra1) => {
        let ctr = arra1.length;
        let temp;
        let index;

        // While there are elements in the array
        while (ctr > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * ctr);
            // Decrease ctr by 1
            ctr--;
            // And swap the last element with it
            temp = arra1[ctr];
            arra1[ctr] = arra1[index];
            arra1[index] = temp;
        }
        return arra1;
    }

    onDoneRowClick = (rowIndex) => {
        if (this.state.currentRowIndex !== rowIndex ||
            this.state.gameState !== GameState.ONGOING)
            return;

        const newRows = this.state.rows.map((row) => {
            return row.slice();
        });

        const currentRow = newRows[rowIndex];

        if (!this.hasRowBeenAnswered(currentRow))
            return;

        let newGameState = this.calculateResult(currentRow);
        let newRowIndex = rowIndex + 1;
        if (newGameState !== GameState.WON && newRowIndex >= this.state.rows.length) {
            newGameState = GameState.GAMEOVER
        }

        this.setState(prevState => ({
            ...prevState,
            rows: newRows,
            currentRowIndex: newRowIndex,
            gameState: newGameState,
        }));
    }

    onBannerClick = () => {
        this.newGame();
    }

    render() {
        return (
            <div className="App">
                <header>
                    <h1> Master Mind </h1>
                    <div className="menu">
                        <button onClick={this.newGame}>New Game</button>
                        <button onClick={this.newAiGame}>AI (dumb) Game</button>
                    </div>
                </header>

                <div className="game">

                    <ColorSelector
                        colors={this.state.pegs}
                        handleClick={this.onSelectColorClick}
                    ></ColorSelector>
                    <Board
                        rows={this.state.rows}
                        handlePositionPegClick={this.onPositionPegClick}
                        handleDoneRowClick={this.onDoneRowClick}
                        currentRowIndex={this.state.currentRowIndex}
                        answer={this.state.answer}
                        gameState={this.state.gameState}
                    ></Board>
                </div>
                <Banner
                    gameState={this.state.gameState}
                    handleBannerClick={this.onBannerClick}></Banner>
            </div>
        );
    }
}