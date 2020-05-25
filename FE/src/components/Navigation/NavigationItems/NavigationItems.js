import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.module.css';

const navigationItems = (props) => {
    const navigationElements = () => {
        return props.navItems.length ? 
        props.navItems.map((navItem, i) => <NavigationItem 
            active={navItem.active} 
            path={navItem.path} 
            linkText={navItem.text} show={navItem.show} 
            key={`${navItem.linkText}${i}`} 
            />) : null;
    }
    return (
    <ul className={classes.NavigationItems}>
        {navigationElements()}
    </ul>
    );
}

export default navigationItems;