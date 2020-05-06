import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// bring in custom components
import Input from '../../components/UI/Input/Input';
import Button from "../../components/UI/Button/Button";
import Spinner from '../../components/UI/Spinner/Spinner';

import { updateObj, formValidation } from '../../shared/index';

// import css classes for the form
import classes from './Auth.css';

// get the required actions
import * as actions from '../../store/actions/index';


class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: "Mail Address"
                },
                value: '',
                validations: {
                    required: true,
                    isEmail: true
                },
                isValid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: "Password"
                },
                value: '',
                validations: {
                    required: true,
                    minLength: 8
                },
                isValid: false,
                touched: false
            }
        },
        isSignup: true
    }

    componentDidMount() {
        if(!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath(this.props.authRedirectPath);
        }
    }

    inputChangeHandler = (event, controlName) => {
        const updatedControls = updateObj(this.state.controls, {
            [controlName]: updateObj(this.state.controls[controlName], {
                value: event.target.value,
                isValid: formValidation(event.target.value, this.state.controls[controlName].validations),
                touched: true
            })
        })
        this.setState({controls: updatedControls});
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    }

    switchAuthState = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup};
        });
    }

    render() {
        const formElementArray = [];
        for( let key in this.state.controls) {
            formElementArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }

        let form = formElementArray.map(elm => {
            return(
                <Input 
                    key={elm.id}
                    elementType={elm.config.elementType} 
                    elementConfig={elm.config.elementConfig} 
                    value={elm.config.value} 
                    shouldValidate={elm.config.validations.required}
                    invalid={elm.config.isValid}
                    modified={elm.config.touched}
                    changed={(event) => {this.inputChangeHandler(event, elm.id)}} 
                />
            )
        })

        if(this.props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;
        if(this.props.error) {
            errorMessage = (
                <p className={classes.error}>{this.props.error.message}</p>
            )
        }
        let redirect = null;
        if(this.props.authenticated) {
            redirect = <Redirect to={this.props.authRedirectPath}/>;
        }

        return(
            <div className={classes.AuthData}>
                {redirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType='Success'>Submit</Button>
                </form>
                <Button 
                    clicked={this.switchAuthState}
                    btnType="Danger">Switch to {this.state.isSignup ? 'Signin' : 'Signup'}</Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        authenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => {
            return dispatch(actions.auth(email, password, isSignup));
        },
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Auth);