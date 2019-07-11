import React from 'react';
import { ColorEnum } from '../Logic/color-enum';
import { GameStateEnum } from '../Logic/game-state-enum';

export default function AnswerRow(props) {

    const renderAnswerPegs = (props) => {
        return props.row.map((value, position) => {
            let key = "white";
            if (props.gameState !== GameStateEnum.ONGOING) {
                key = Object.keys(ColorEnum)[value];
            }
            let classes = `circle ${key.toLowerCase()}`;
            return (
                <div
                    key={position}
                    className={classes}
                ></div>
            )
        });
    };

    return (
        <div className="row asphalt last-row">
            <div className="pegs">
                {renderAnswerPegs(props)}
            </div>
        </div>
    );
}