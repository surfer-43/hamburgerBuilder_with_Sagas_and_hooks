import React from "react";

import classes from "./Order.css";

const order = (props) => {

    // going to loop over all the ingredients and populate them in a list
    let ingredients = [];

    for ( let ingredientName in props.ingredients){
        ingredients.push({name: ingredientName, amount: props.ingredients[ingredientName]});
    }

    const ingredientOutput = ingredients.map( ig => {
        return (
            <li
            style={{
                textTransform: 'capitalize',
                display: 'inline-block',
                margin: '0 8px',
                padding: '5px',
                border: '1px solid #ccc'
            }} 
            key={ig.name}>{ig.name} : {ig.amount}</li>
        )
    })
    return (
        <div className={classes.Order}>
            <p>Ingredients:</p>
            <ul>
                {ingredientOutput}
            </ul>
            <p>Price: <strong>${Number.parseFloat(props.price).toFixed(2)}</strong></p>
        </div>
    )
}

export default order;