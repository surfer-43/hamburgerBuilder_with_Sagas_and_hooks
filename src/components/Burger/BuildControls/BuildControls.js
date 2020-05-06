import React from 'react';

// custom css
import classes from './BuildControls.css';

// custom components
import BuildControl from "./BuildControl/BuildControl";

const controls = [
    {label: 'Salad', type:'salad'},
    {label: 'Bacon', type:'bacon'},
    {label: 'Cheese', type:'cheese'},
    {label: 'Meat', type:'meat'},
];
const BuildControls = (props) => {
    return (
        <div className={classes.BuildControls}>
            <p>Current price: <strong>${props.price.toFixed(2)}</strong></p>
            {controls.map(ctr => {
                    return <BuildControl 
                    key={ctr.label} 
                    label={ctr.label}
                    added={() => props.ingredientAdded(ctr.type)}
                    removed={() => props.ingredientRemoved(ctr.type)}
                    disabled={props.disabled[ctr.type]}
                />
            })}
            <button 
                className={classes.OrderButton} 
                disabled={!props.purchasable}
                onClick={props.checkout}
                >{props.isAuth ? 'Order Now' : 'Sign in to order'}</button>
        </div>
    );
};

export default BuildControls;