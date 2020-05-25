import React from 'react';
import { Link } from 'react-router-dom';

import classes from './NavigationItem.module.css';

const navigationItem = (props) => {
        let auxliraryClasses = props.active ? classes.Active : '';
        auxliraryClasses += props.show ? '' : classes.Hide;
        return (
        <li className={classes.NavigationItem}>
            <Link className={`${auxliraryClasses}`} to={props.path} >{props.linkText}</Link>
        </li>);
};

export default navigationItem;