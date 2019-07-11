import React from 'react';

export const ColorEnum = {
    BLACK: 0,
    RED: 1,
    GREEN: 2,
    BLUE: 3,
    YELLOW: 4,
    ORANGE: 5,
    PURPLE: 6
};

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