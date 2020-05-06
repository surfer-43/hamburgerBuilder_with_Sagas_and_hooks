import React from 'react';

// custom content
import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.css'

const logo =(props) => {
    return(
        <div className={classes.BurgerLogo}>
            <img src={burgerLogo} alt="Hamburger Builder logo" />
        </div>
        
    )
}

export default logo;