import React from 'react';

import Button from '../Button/Button';

import classes from './AdjacentButtons.module.css';

const adjacentButtons = (props) => {
    const numberOfAdjacentButtons = () => {
        const buttons = []
        for(let i=0; i < props.numOfButtons; i++) {
            buttons.push(<Button 
                auxilaryClasses={props.buttons[i].extraClasses()} 
                btnType={props.buttons[i].type} 
                key={props.buttons[i].type+i} 
                clicked={props.buttons[i].clickHandler}
                >{props.buttons[i].text}
            </Button>)
        }
        return buttons
    }
    return (
        <div className={classes.Container}>
            {numberOfAdjacentButtons()}
        </div>
    );
}

export default adjacentButtons;