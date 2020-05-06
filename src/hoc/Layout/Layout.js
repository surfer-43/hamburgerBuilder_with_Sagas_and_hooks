import React, { useState } from "react";

// import custom CSS classes
import classes from './Layout.css';

// import custom classes
import Aux from '../Aux/Aux';
import { connect } from 'react-redux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const layout = (props) => {
    const [showSideDrawer, setShowSideDrawer] = useState(false)
    

    const sideDrawerClosedHandler = () => {
        setShowSideDrawer( !showSideDrawer );
    }

    return (
        <Aux>
            <Toolbar 
                isAuth={props.isAuthenticated}
                opened={showSideDrawer}
                closed={sideDrawerClosedHandler}/>
            <SideDrawer 
                isAuth={props.isAuthenticated}
                opened={showSideDrawer} 
                closed={sideDrawerClosedHandler}/>
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux> 
    )
    
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(layout);