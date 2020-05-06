import axios from 'axios';
import { put, delay, call } from 'redux-saga/effects';
// import * as actionTypes from '../actions/actionTypes';
import * as actions from '../actions/index';

/**
 * 'function*' are "generators"?
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function* - official docs
 * https://medium.com/dailyjs/a-simple-guide-to-understanding-javascript-es6-generators-d1c350551950 - get an understanding
 * 
 * the "yield" - exicute the current step and wait for it to finish
 */
export function* authUserSaga(action) {
    console.log("what is inside the action: ", action);
    // remember that we need to pass the token as part of the 
    // action pyload
    const apiKey = action.data.firebaseToken;
    yield put (actions.authStart());
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+apiKey;

    if(!action.data.isSignup){
        url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+apiKey;
    }

    try{
        const resp = yield axios.post(url, action.data)
            
        const expirationData = yield new Date(new Date().getTime() + (resp.data.expiresIn * 1000));
        yield localStorage.setItem('token', resp.data.idToken);
        yield localStorage.setItem('expirationDate', expirationData);
        yield localStorage.setItem('userId', resp.data.localId);
        yield put(actions.authSuccess(resp.data.idToken, resp.data.localId));
        yield put(actions.checkAuthTimeout((resp.data.expiresIn * 1000)));
    } catch (err) {
        console.error("sign up or in falied: ", err);
        yield put(actions.authFail(err.response.data.error));
    }
}

export function* authCheckStateSaga() {
    const token = yield localStorage.getItem('token');

    if(!token) {
        yield put(actions.authLogout());
    } else {
        const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
        if(expirationDate > new Date()) {
            const userId = yield localStorage.getItem('userId');
            yield put(actions.authSuccess(token, userId));
            yield put(actions.checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
        } else {
            yield put(actions.authLogout());
        }
    }
}

export function* logoutSaga() {
    // using the call method allows for unit testing 
    // it allows you to mock the data 
    yield call([localStorage, 'removeItem'],'token')
    yield call([localStorage, 'removeItem'],'expirationDate')
    yield call([localStorage, 'removeItem'],'userId')

    // 'put' in this case will dispatch the action 'AUTH_LOGOUT'
    // yield put({
    //     type: actionTypes.AUTH_LOGOUT
    // })

    // cleaning up - this is a consistent way to use actions 
    yield put(actions.authLogoutProceed());
}

export function* checkAuthTimeoutSaga(action) {
    // delays the rest of the code for the time specified
    yield delay(action.expirationTime);
    yield put(actions.authLogout());    
}