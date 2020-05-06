import * as actionTypes from '../actions/actionTypes';
import { updateObj } from '../../shared/utility';

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false, 
    building: false
}

const ingredientPrices = {
    salad: .5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
}

const addIngredient = (state, action) => {
    const updatedIngredient = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1}
    const updatedIngredients = updateObj(state.ingredients, updatedIngredient);
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + ingredientPrices[action.ingredientName], 
        building: true
    }
    return updateObj(state, updatedState)
}

const removeIngredient = (state, action) => {
    const updatedIngredientReduced = {[action.ingredientName]: state.ingredients[action.ingredientName] - 1}
    const updatedReducedIngredients = updateObj(state.ingredients, updatedIngredientReduced);
    const updatedReducedState = {
        ingredients: updatedReducedIngredients,
        totalPrice: state.totalPrice + ingredientPrices[action.ingredientName],
        building: true
    }
    return updateObj(state, updatedReducedState);
}

const setIngredients = (state, action) => {
    return updateObj(state, {
        ingredients: {
            salad: action.ingredients.salad,
            meat: action.ingredients.meat,
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
        }, 
        error: false, 
        totalPrice: 4,
        building: false
    });
};

const fetchIngredientFailed = (state, action) => {
    return updateObj(state, {error: true});
}

const reducer = (state=initialState, action) => {
    switch(action.type) {
        case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
        case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);            
        case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
        case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientFailed(state, action);
        default:
            return state
    }
}

export default reducer;