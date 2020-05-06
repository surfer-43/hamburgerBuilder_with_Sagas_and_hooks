import React from 'react';

// custom components and styles
import classes from './NavItems.css';
import NavItem from './NavItem/NavItem';

const navItems = (props) => {
    const button = props.authenticated ? (<NavItem link="/logout">Sign out</NavItem>):(<NavItem link="/auth">Sign in</NavItem>);
    const ordersLink = props.authenticated ? (<NavItem link="/orders" >Orders</NavItem>) : null;
    return (
        <ul className={classes.NavItems}>
            <NavItem link="/" exact >Burger Builder</NavItem>
            {ordersLink}
            {button}
        </ul>
    )
}

export default navItems;