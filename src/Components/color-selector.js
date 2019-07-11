import React from 'react';
import { ColorEnum } from '../Logic/color-enum';

export class ColorSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            colors: props.colors,
        }

        this.selectColorClick = props.handleClick;
    }
    renderColors = () => {
        return this.state.colors.map(item => {
            const key = Object.keys(ColorEnum)[item.color];
            let classes = `circle ${key.toLowerCase()}`;
            if (item.isSelected) {
                classes += ' selected';
            }
            return (
                <div
                    key={item.color}
                    className={classes}
                    onClick={() => this.selectColorClick(item)}>
                </div>
            )
        });
    };

    render() {
        return (
            <div className="color-selector" >
                {this.renderColors()}
            </div>
        );
    }
}