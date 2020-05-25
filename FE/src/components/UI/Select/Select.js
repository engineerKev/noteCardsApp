import React from 'react';

import classes from './Select.module.css';

const select = (props) => {
    return (
        <div className={classes.SelectContainer}>
            <select className={classes.Select} value={props.selectVal} onChange={props.selectOnChange}>
                <option key={`default-0`} defaultValue={""}>{props.defaultOptionText}</option>
                {props.options.map((option, i) => {
                    return (<option key={`${option.id}${i}`} value={option.id}>{option.title}</option>);
                })}
            </select>
        </div>
    )
}

export default select;