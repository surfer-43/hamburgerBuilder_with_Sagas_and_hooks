import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';
import * as actions from '../actions/index';

export function* purchaseOrderSaga(action) {
    console.log("inside the purchaseOrderSaga");
    yield put(actions.purchaseOrderStart());

    try {
        const resp = yield axios.post('/orders.json?auth='+action.data.token, action.data.orderData)
        yield put(actions.purchaseOrderSuccess(resp.data.name, action.data.orderData));
    } catch( err ) {
        yield put(actions.purchaseOrderFail(err));
    } 
    
}

export function* fetchOrdersSaga(action){
    console.log("inside the fetchOrdersSaga");
    yield put(actions.fetchOrdersStart());
    /**
     * special not - query params must be "{variableName}" format
     * '{variableName}' in single quotes doesn't work
     */
    const queryParams = '?auth='+action.data.token+'&orderBy="userId"&equalTo="'+action.data.userId+'"';
    try {
        const resp = yield axios.get("/orders.json"+queryParams);
        console.log("do we get info back from the axios call: ", resp);
        const fetchedData = [];
        for ( let key in resp.data) {
            fetchedData.push({
                ...resp.data[key],
                id: key
            });
        }
        console.log("what is the fetchedData value: ", fetchedData);
        yield put(actions.fetchOrdersSuccess(fetchedData));
    } catch ( err ) {
        yield put(actions.fetchOrdersFail(err));
    }
}
