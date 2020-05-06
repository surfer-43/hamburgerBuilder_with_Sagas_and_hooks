import React from 'react';

// import custom components
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button'

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients).map(igKey => {
        return (
            <li key={igKey}>
                <span style={{textTransform: 'capitalize'}}>{igKey}: {props.ingredients[igKey]}</span>
            </li>
        );
    })

    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p>Total price: <strong>${props.price.toFixed(2)}</strong></p>
            <p>Continue to checkout?</p>

            <Button 
                btnType="Danger"
                clicked={props.checkoutCancel}
            >Cancel</Button>
            <Button
                btnType="Success"
                clicked={props.checkoutContinue}
            >Continue</Button>
        </Aux>
    );
}

export default orderSummary;