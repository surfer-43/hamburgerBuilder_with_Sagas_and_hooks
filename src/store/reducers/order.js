import * as actionTypes from '../actions/actionTypes';
import { updateObj } from '../../shared/utility';

const initialState = {
    orders: [],
    loading: false,
    purchased: false
}

const orderReducer = (state = initialState, action) => {

    const purchaseInit = (state, action) => {
        return updateObj( state, {purchased: false});
    }
    const purchaseStart = (state, action) => {
        return updateObj( state, {loading: true});
    }
    const purchaseSuccess = (state, action) => {
        const newOrder = updateObj(action.orderData, {id: action.orderId});
        return updateObj( state, {loading: false, orders: state.orders.concat(newOrder), purchased: true});
    }
    const purchaseFail = (state, action) => {
        return updateObj( state, {loading: false});
    }

    const fetchOrderstart = (state, action) => {
        return updateObj( state, {loading: true});
    }
    const fetchOrderSuccess = (state, action) => {
        return updateObj( state, {orders: action.orders, loading: false});
    }
    const fetchOrderFail = (state, action) => {
        return updateObj( state, {loading: false}); 
    }

    switch(action.type) {
        case actionTypes.PURCHASE_INIT: return purchaseInit(state, action);
        case actionTypes.PURCHASE_BURGER_START: return purchaseStart(state, action);
        case actionTypes.PURCHASE_BURGER_SUCCESS: return purchaseSuccess(state, action);
        case actionTypes.PURCHASE_BURGER_FAIL: return purchaseFail(state, action);
        case actionTypes.FETCH_ORDERS_START: return fetchOrderstart( state, action);
        case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrderSuccess( state, action);
        case actionTypes.FETCH_ORDERS_FAIL: return fetchOrderFail( state, action);
        default: return state;
    }
}

export default orderReducer;