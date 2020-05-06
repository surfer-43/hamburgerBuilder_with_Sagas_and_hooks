import { all, takeLatest, takeEvery, } from 'redux-saga/effects';
import { 
    authUserSaga,
    authCheckStateSaga,
    logoutSaga,
    checkAuthTimeoutSaga } from "./auth";
import {
    initIngredientsSaga
} from './burgerBuilder';
import {
    purchaseOrderSaga,
    fetchOrdersSaga
} from './order';
        
import * as actionTypes from '../actions/actionTypes';

export function* watchAuth(){
    yield all([
        takeEvery(actionTypes.AUTH_USER, authUserSaga),
        takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga),
        takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
        takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga)
    ]);
};

export function* watchBurgerBuilder() {
    yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
}

export function* watchOrder() {
    /**
     * instead of taking every actionType
     * take only the latest of PURCHASE_ORDER
     * incase the user decided to click on it multiple times
     */
    yield takeLatest(actionTypes.PURCHASE_ORDER, purchaseOrderSaga);
    yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga);
}

