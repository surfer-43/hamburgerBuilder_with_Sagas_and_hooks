import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';
import * as actions from '../actions/index';

export function* initIngredientsSaga() {
    console.log("inside the initIngredientSaga");
    try {
        const resp = yield axios.get('https://my-burger-df13e.firebaseio.com/Ingredients.json')
        yield put(actions.setIngredients(resp.data));
    } catch( err ) {
        yield put(actions.fetchIngredientsFailed(err));
    }    
}