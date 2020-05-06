import React from 'react';
import { NavLink } from "react-router-dom";

// custom classes
import classes from './NavItem.css';

const navItem = (props) => {
    return (
        <li className={classes.NavItem}>
            <NavLink 
                to={props.link}
                exact = {props.exact}
                activeClassName={classes.active}>{props.children}</NavLink>
        </li>
    );
}

export default navItem;