import React from 'react';
import { ColorEnum } from '../Logic/color-enum';

export default function Row(props) {

    const renderPegs = (props) => {
        return props.row.map((value, position) => {
            let key;
            if (position > 3)
                return null;
            if (value === 0) {
                key = 'black';
            } else {
                key = Object.keys(ColorEnum)[value];
            }

            let classes = `circle ${key.toLowerCase()}`;
            return (
                <div
                    key={position}
                    className={classes}
                    onClick={() => props.handlePositionPegClick(props.rowIndex, position)}>
                </div>
            )
        });
    };

    const renderAnswerPegs = (props) => {
        return props.row.map((value, position) => {
            if (position < 4)
                return null;

            let key = 'grey';
            if (value === 1) {
                key = 'white'
            } else if (value === 2) {
                key = 'black';
            }

            let classes = `circle small ${key.toLowerCase()}`;
            return (
                <div
                    key={position}
                    className={classes}
                    onClick={() => props.handlePositionPegClick(props.rowIndex, position)}>
                </div>
            )
        });
    }

    let side;
    let classes = "row";
    if (props.rowIndex === props.currentRowIndex) {
        side = <button className="done-button"
            onClick={() => props.handleDoneRowClick(props.rowIndex)}>
            Ok</button>;
        classes += " white";
    } else {
        side = renderAnswerPegs(props);
    }

    return (
        <div className={classes}>
            <div className="pegs">
                {renderPegs(props)}
            </div>

            <div className="side">
                {side}
            </div>
        </div>
    );
}