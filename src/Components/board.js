import React from 'react';
import Row from './row';
import AnswerRow from './answer-row';

export default class Board extends React.Component {
    renderRows() {
        return this.props.rows.map((row, index) => {
            return <Row
                key={index}
                rowIndex={index}
                row={row}
                handlePositionPegClick={this.props.handlePositionPegClick}
                handleDoneRowClick={this.props.handleDoneRowClick}
                currentRowIndex={this.props.currentRowIndex}
                gameState={this.props.gameState}
            ></Row>
        });
    };

    renderAnswer() {
        return <AnswerRow
            row={this.props.answer}
            gameState={this.props.gameState}
        ></AnswerRow>
    };


    render() {
        return (
            <div className="board" >
                {this.renderRows()}
                {this.renderAnswer()}
            </div >
        );
    };
}