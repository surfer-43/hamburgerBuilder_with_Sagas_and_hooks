import React, { Component } from 'react';
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
export class BurgerBuilder extends Component {
    /**
     * initial state of the application
     */
    state = {
        inCheckout: false
    }

    componentDidMount () {
        this.props.initIngredients();
    }

    updatePurchaseState (ingredients) {
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

    checkoutHandler = () => {
        if(this.props.authenticated) {
            this.setState({inCheckout:true})
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    clearModal = () => {
        this.setState({inCheckout:false})
    }

    checkoutContinueHandler = () => {
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
        this.props.initPurchase();

        // with Redux:
        this.props.history.push({pathname: "/checkout"});
    }
    
    render() {
        const disabledInfo = {
            ...this.props.ings
        };

        let burger = this.props.error ? <p> Ingredients can't be loaded</p> : <Spinner /> 
        let orderSummary = null;

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0 
        }

        if(this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        ingredientAdded={this.props.addIngredient}
                        ingredientRemoved={this.props.removeIngredient}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        checkout={this.checkoutHandler}
                        price={this.props.price}
                        isAuth={this.props.authenticated}
                        modifyPrice={this.props.modifyPrice}
                    />  
                </Aux>
            );

            orderSummary = <OrerSummary 
                checkoutCancel={this.clearModal}
                checkoutContinue={this.checkoutContinueHandler}
                ingredients={this.props.ings}
                price={this.props.price}
            />
        }

        return (
            <Aux>
                <Modal 
                    show={this.state.inCheckout}
                    modalClosed={this.clearModal}
                >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
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
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));