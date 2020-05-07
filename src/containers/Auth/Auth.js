import React, { useState, useEffect } from 'react';
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


const auth = props => {
    const [controls, setControls] = useState(
        {
        
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
    
    })
    
    const [isSignup, setIsSignup] = useState( true );
    

    useEffect(() => {
        if(!props.buildingBurger && props.authRedirectPath !== '/') {
            props.onSetAuthRedirectPath(props.authRedirectPath);
        }
    }, [])

    const inputChangeHandler = (event, controlName) => {
        const updatedControls = updateObj(controls, {
            [controlName]: updateObj(controls[controlName], {
                value: event.target.value,
                isValid: formValidation(event.target.value, controls[controlName].validations),
                touched: true
            })
        })
        setControls(updatedControls);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(controls.email.value, controls.password.value, isSignup);
    }

    const switchAuthState = () => {
        setIsSignup(!isSignup);
    }

    
        const formElementArray = [];
        for( let key in controls) {
            formElementArray.push({
                id: key,
                config: controls[key]
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
                    changed={(event) => {inputChangeHandler(event, elm.id)}} 
                />
            )
        })

        if(props.loading) {
            form = <Spinner />;
        }

        let errorMessage = null;
        if(props.error) {
            errorMessage = (
                <p className={classes.error}>{props.error.message}</p>
            )
        }
        let redirect = null;
        if(props.authenticated) {
            redirect = <Redirect to={props.authRedirectPath}/>;
        }

        return(
            <div className={classes.AuthData}>
                {redirect}
                {errorMessage}
                <form onSubmit={submitHandler}>
                    {form}
                    <Button btnType='Success'>Submit</Button>
                </form>
                <Button 
                    clicked={switchAuthState}
                    btnType="Danger">Switch to {isSignup ? 'Signin' : 'Signup'}</Button>
            </div>
        )
    
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
export default connect(mapStateToProps, mapDispatchToProps)(auth);