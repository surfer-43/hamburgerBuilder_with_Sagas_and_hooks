import React from 'react';

// import custom stuff
import classes from './Toolbar.css';

import HamburgerNavIcon from '../SideDrawer/HamburgerNavIcon/HamburgerNavIcon';
import NavItems from '../NavItems/NavItems';
import BurgerLogo from '../../../components/Logo/Logo';

const toolbar = (props) => {
    return( 
        <header className={classes.Toolbar}>
            <HamburgerNavIcon clicked={props.closed}/>
            <div className={classes.Logo}>
                <BurgerLogo />
            </div>
            <nav className={classes.DesktopOnly}>
                <NavItems 
                   authenticated={props.isAuth} 
                />
            </nav>
        </header>
    )
}

export default toolbar;