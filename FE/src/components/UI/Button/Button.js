import React from 'react';

import classes from './Button.module.css';

const button = (props) => {
    const classesFromProps = () => {
        let classesStr = props.auxilaryClasses ? props.auxilaryClasses : '';
        return classesStr.split(' ').map(classKey => classes[classKey]);
    }
    return (
        <button
            disabled={props.disabled}
            className={[classes.Button, classes[props.btnType], ...classesFromProps()].join(' ')}
            onClick={props.clicked}
            type={props.type}
        >
            {props.children}
        </button>    
    );
};

export default button;