import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'

// custom components
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls"
import axios from '../../axios-orders';

// add the modal overlay where we access and control state
import Modal from '../../components/UI/Modal/Modal';
import OrerSummary from '../../components/Burger/OrderSummary/OrderSummary';

// add the spinner for the loading state
import Spinner from '../../components/UI/Spinner/Spinner';

// adding the higher order component to handle any errors
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

// bringing in the different actions
// import * as actionTypes from '../../store/actions/actionTypes';
import * as actions from '../../store/actions/index';

/**
 * by adding the 'export' infront of class
 * we get a named export giving us access to the class so we can test it
 */
const burgerBuilder = (props) => {
    const { initIngredients } = props;
    /**
     * initial state of the application
     */
    const [ inCheckout, setInCheckout ] = useState(false);

    useEffect(() => {
        initIngredients();
    }, [ initIngredients ]);
    

    const updatePurchaseState = (ingredients) => {
        // one way to see if the state should be switched
        // we are looping through all the elements in the array anyway just for a 
        // boolean flag... Array.every does the same thing and returns t/f if all 
        // elements meet the requirement

        const sum = Object.keys(ingredients)
        .map(ingredientKey => {
            return ingredients[ingredientKey]
        }).reduce((sum, el) => {
            return sum + el
        }, 0);
        return sum > 0;
    }

    const checkoutHandler = () => {
        if(props.authenticated) {
            setInCheckout(true)
        } else {
            props.onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }

    const clearModal = () => {
        setInCheckout(false)
    }

    const checkoutContinueHandler = () => {
        /**
            * // create url with query params for the actual burger built
            * const burgerIngredient = Object.keys(this.state.ingredients);

            * // burgerIngredientData = null;
            * let burgerData = burgerIngredient.map( p => {
                * let value = encodeURIComponent(p) + "=" + encodeURIComponent(this.state.ingredients[p].toString());
                * return value;
            * });
            * burgerData.push("price=" + this.props.price);
            * const queryString = burgerData.join("&");
            * this.props.history.push({pathname: "/checkout", search: "?"+queryString});
        */

        // initializing the purchase state
        props.initPurchase();

        // with Redux:
        props.history.push({pathname: "/checkout"});
    }
    
    
        const disabledInfo = {
            ...props.ings
        };

        let burger = props.error ? <p> Ingredients can't be loaded</p> : <Spinner /> 
        let orderSummary = null;

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0 
        }

        if(props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={props.ings}/>
                    <BuildControls 
                        ingredientAdded={props.addIngredient}
                        ingredientRemoved={props.removeIngredient}
                        disabled={disabledInfo}
                        purchasable={updatePurchaseState(props.ings)}
                        checkout={checkoutHandler}
                        price={props.price}
                        isAuth={props.authenticated}
                        modifyPrice={props.modifyPrice}
                    />  
                </Aux>
            );

            orderSummary = <OrerSummary 
                checkoutCancel={clearModal}
                checkoutContinue={checkoutContinueHandler}
                ingredients={props.ings}
                price={props.price}
            />
        }

        return (
            <Aux>
                <Modal 
                    show={inCheckout}
                    modalClosed={clearModal}
                >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        authenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addIngredient: (ingName) => dispatch(actions.addIngredient(ingName)),
        removeIngredient: (ingName) => dispatch(actions.removeIngredient(ingName)),
        initIngredients: () => dispatch(actions.initIngredients()),
        initPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

/**
 * the higher order component used here needs to be used with axios or some other
 * method to make http requests and handle interceptors
 */
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(burgerBuilder, axios));