// Enzyme API: http://airbnb.io/enzyme/docs/api/
// Jest Docs: https://facebook.github.io/jest/
import * as actionTypes from "./actionTypes";
import { firebaseToken } from '../../tokens/firebaseToken';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
};
export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
};
export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const authLogout = () => {
    console.log("inside authLogout");
    // localStorage.removeItem('token');
    // localStorage.removeItem('expirationDate');
    // localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_INITIATE_LOGOUT
    }
}

export const authLogoutProceed = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expiresTime) => {
    return {
        type: actionTypes.AUTH_CHECK_TIMEOUT,
        expirationTime: expiresTime
    }
}

export const authCheckState = () => {
    return {
        type: actionTypes.AUTH_CHECK_STATE
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const auth = (email, password, isSignup) => {
    const authData = {
        email,
        password,
        returnSecureToken: true,
        isSignup,
        firebaseToken
    }
    return {
        type: actionTypes.AUTH_USER,
        data: authData
    }
}
