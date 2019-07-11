import React from 'react';
import { GameStateEnum } from '../Logic/game-state-enum';
import './banner.css';

export default function Banner(props) {

    let text = "Sample Text";
    let classes = "banner";
    if (props.gameState === GameStateEnum.GAMEOVER) {
        text = "Game Over";
        classes += " show";
    } else if (props.gameState === GameStateEnum.WON) {
        text = "You Won!";
        classes += " show";
    }
    return (
        <div
            className={classes}
            onClick={() => props.handleBannerClick()}>
            <h1 className="state-text">
                {text}
            </h1>

        </div>
    );
}