import React from 'react';
import { withRouter } from 'react-router-dom';

import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './Toolbar.module.css';

const toolbar = (props) => {
    const generateNavItems = () => {
        let navElements = [
            {
                active: false,
                path: "/",
                text: "Home",
                show: true
            },
            {
                active: false,
                path: "/notecards",
                text: "Notecards",
                show: true
            },
            {
                active: false,
                path: "/newstack",
                text: "Create Stack",
                show: true
            },
            {
                active: false,
                path: "/newnotecard",
                text: "New Note Card",
                show: true
            },
            {
                active: false,
                path: "/stacks",
                text: "Stacks",
                show: true
            }
        ];
        const indexOfRoute = getIndexOfCurrentRoute(navElements);
        const indexOfActive = getIndexOfCurrentActive(navElements);
        if (indexOfActive > -1) {
            navElements[indexOfActive].active = !navElements[indexOfActive].active;
        }
        navElements[indexOfRoute].active = !navElements[indexOfRoute].active;
        return navElements;
    }

    const getIndexOfCurrentRoute = (navItems) => {
        return navItems.map(e => e.path).indexOf(props.history.location.pathname);
    }

    const getIndexOfCurrentActive = (navItems) => {
        return navItems.map(e => e.active).indexOf(true);
    }

    return (
        <header className={classes.ToolbarContainer}>
            <div className={classes.Toolbar}>
                <NavigationItems navItems={generateNavItems()} />
            </div>
        </header>
    );
}

export default withRouter(toolbar);