import React, { useState, useEffect, useCallback } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux'

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
    /**
     * initial state of the application
     */
    const [ inCheckout, setInCheckout ] = useState(false);

    /**
     * using the redux hooks to extract actions from the props
     */
    const dispatch = useDispatch();

    /**
     * special case - initIngredients() is used inside useEffect which is called every time
     * initIngredients is changed/created which causes a rerender and loops.
     * using useCallback to wrap this function will prevent that because we are
     * creating an instance of the function in a closure? - confirm
     */
    const initIngredients = useCallback(() => dispatch(actions.initIngredients()), []);

    const addIngredient = (ingName) => dispatch(actions.addIngredient(ingName));
    const removeIngredient = (ingName) => dispatch(actions.removeIngredient(ingName));
    const initPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    const ings = useSelector( (state) => {
        return state.burgerBuilder.ingredients
    });

    const price = useSelector( (state) => {
        return state.burgerBuilder.totalPrice
    });

    const error = useSelector( (state) => {
        return state.burgerBuilder.error
    });

    const authenticated = useSelector( (state) => {
        return state.auth.token !== null
    });



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
        if(authenticated) {
            setInCheckout(true)
        } else {
            onSetAuthRedirectPath('/checkout');
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
        initPurchase();

        // with Redux:
        props.history.push({pathname: "/checkout"});
    }
    
    
        const disabledInfo = {
            ...ings
        };

        let burger = error ? <p> Ingredients can't be loaded</p> : <Spinner /> 
        let orderSummary = null;

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0 
        }

        if(ings) {
            burger = (
                <Aux>
                    <Burger ingredients={ings}/>
                    <BuildControls 
                        ingredientAdded={addIngredient}
                        ingredientRemoved={removeIngredient}
                        disabled={disabledInfo}
                        purchasable={updatePurchaseState(ings)}
                        checkout={checkoutHandler}
                        price={price}
                        isAuth={authenticated}
                        modifyPrice={props.modifyPrice}
                    />  
                </Aux>
            );

            orderSummary = <OrerSummary 
                checkoutCancel={clearModal}
                checkoutContinue={checkoutContinueHandler}
                ingredients={ings}
                price={price}
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

/**
 * if using the react redux hooks, it's not required to use 
 * mapStateToProps or mapDispatchToProps
 * use useDispatch, useSelector from react redux and then
 * export without the connect function
 */
export default withErrorHandler(burgerBuilder, axios);


/**
 * this method is valid for functional components
 * and will still work as expected
 * 
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


 * the higher order component used here needs to be used with axios or some other
 * method to make http requests and handle interceptors
 
 export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(burgerBuilder, axios));
 */