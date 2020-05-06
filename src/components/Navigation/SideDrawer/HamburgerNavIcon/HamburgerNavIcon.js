import React from 'react';

// cusotm elements
import classes from './HamburgerNavIcon.css';

const HamburgerNavIcon = (props) => {
    return (
        <button 
            className={classes.HamburgerIconContainer}
            onClick={props.clicked}
            >
            <span></span>
            <span></span>
            <span></span>
        </button>
    )
}

export default HamburgerNavIcon;