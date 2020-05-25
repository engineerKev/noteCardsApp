import React from 'react';

import classes from './Input.module.css';


const input = (props) => {
    // debugger;
    let inputElement = null;

    const inputClasses = () => {
        if(props.invalid === "true" && props.touched === "true") {
            return `${classes.InputElement} ${classes.Invalid}`;
        }
        return classes.InputElement;
    }
    
    const selectClasses = () => {
        if(props.invalid === "true" && props.touched === "true") {
            return `${classes.Select} ${classes.Invalid}`;
        }
        return classes.Select;
    }

    switch (props.elementtype) {
        case 'input':
            inputElement = <input className={inputClasses()} {...props} />;
            break;
        case 'textarea':
            inputElement = <textarea className={inputClasses()} {...props}/>;
            break;
        case 'select':
            inputElement = (
                <div className={classes.SelectContainer}>
                    <select className={selectClasses()} value={props.value} onChange={props.onChange}>
                        <option key={`default-0`} value={""}>{props.placeholder}</option>
                        {props.options.map((option, i) => {
                            return (<option key={`${option.id}${i}`} value={option.id}>{option.title}</option>);
                        })}
                    </select>
                </div>
        );
        break;
        default:
            inputElement = <input className={inputClasses()} {...props}/>
    }
    return(
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    );
};

export default input;