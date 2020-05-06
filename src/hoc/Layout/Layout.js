import React, { Component } from "react";

// import custom CSS classes
import classes from './Layout.css';

// import custom classes
import Aux from '../Aux/Aux';
import { connect } from 'react-redux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState((prevState)=>{
            return{ showSideDrawer: !prevState.showSideDrawer };
        })
    }

    render() {
        return (
            <Aux>
                <Toolbar 
                    isAuth={this.props.isAuthenticated}
                    opened={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler}/>
                <SideDrawer 
                    isAuth={this.props.isAuthenticated}
                    opened={this.state.showSideDrawer} 
                    closed={this.sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux> 
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);