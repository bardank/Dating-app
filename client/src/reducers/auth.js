import {SIGNUP_SUCCESS, SIGNUP_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, TOKEN_SUCCESS, TOKEN_FAIL, RESET_PASSWORD, CHANGE_EMAIL} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    resetPassword: false,
    resetLoading: true
}
export default function(state = initialState, action){
    const{type, payload} = action ;
    switch(type){
        case TOKEN_SUCCESS:
            return{
                ...state,
                resetPassword: true,
                resetLoading: false
            }
        case TOKEN_FAIL:
            return{
                ...state,
                resetPassword: false,
                resetLoading: false
            }
        case USER_LOADED:
        case CHANGE_EMAIL:
            return{
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload,
                resetPassword: false,
                resetLoading: true
            }
        case LOGIN_SUCCESS:
        case RESET_PASSWORD:
        case SIGNUP_SUCCESS:
            localStorage.setItem('token', payload)
            return {
                ...state,
                token: payload,
                isAuthenticated: true,
                loading: false
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case SIGNUP_FAIL:
        case LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                resetPassword: false,
                resetLoading: true
            }
        
    default : return state
}
}