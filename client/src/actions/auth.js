import axios from 'axios';
import {SIGNUP_SUCCESS, SIGNUP_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE, TOKEN_SUCCESS, TOKEN_FAIL, RESET_PASSWORD, RESET_PASS_ERR, CHANGE_EMAIL, CHANGE_EMAIL_FAIL, CHANGE_PASSWORD, CHANGE_PASSWORD_FAIL} from './types';
import {setAlert} from './alert';
import {getCurrentProfile} from './profile';
import setAuthToken from '../utilis/setAthToken';

export const loadUser = ()=> async dispatch =>{
    if(localStorage.token){
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

export const register = ({name, email, password, birthdate})=> async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({name, email, password, birthdate});
    try {
        const res = await axios.post('/api/users/', body, config)
        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors ;
        if (errors){
            dispatch(setAlert(errors[0].msg, 'danger','signup'))
        }
        dispatch({
            type: SIGNUP_FAIL,
        })
    }

}

export const login = (email, password)=> async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ email, password});
    try {
        const res = await axios.post('/api/auth/', body, config)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        dispatch(loadUser())
    } catch (err) {
        const errors = err.response.data.errors ;
        if (errors){
            dispatch(setAlert(errors[0].msg, 'danger','signin'))
        }
        dispatch({
            type: LOGIN_FAIL,
        })
    }

};

export const logout = ()=>  dispatch =>{
    dispatch({
        type: LOGOUT
    })
    dispatch({
        type: CLEAR_PROFILE
    })
};

export const forgotPassword = (email)=> async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ email});
    try {
        await axios.post('/api/forgotpassword', body, config)
        dispatch(setAlert(`Thanks! Password reset link has been sent to ${email}`, 'success','forgotPass', 80000))
    } catch (err) {
        const errors = err.response.data.errors ;
        if (errors){
            dispatch(setAlert(errors[0].msg, 'danger','forgotPass', 80000))
        }
    }

};

export const checkToken = (token, history)=> async dispatch =>{
    
    try {
        await axios.get(`/api/reset/${token}`)
        dispatch({
            type: TOKEN_SUCCESS
        });
        history.push(`/app/resetpassword/${token}`);
    } catch (err) {
        dispatch({
            type: TOKEN_FAIL
        });
        history.push('/app/invalidtoken')

    }

};

export const resetPass = (password,token , history)=> async dispatch =>{
    
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ password});
    try {
        const res = await axios.patch(`/api/resetpassword/${token}`, body, config)
        dispatch({
            type: RESET_PASSWORD,
            payload: res.data
        })
        
        history.push('/app/dashboard')
    } catch (err) {
        const errors = err.response.data.errors ;
        if (errors){
            dispatch(setAlert(errors[0].msg, 'danger','resetPass'))
        }
        dispatch({
            type: RESET_PASS_ERR
        });
        history.push('/app/invalidtoken')

    }

};
export const emailChange = (email, password, history)=> async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ email, password});
    try {
        const res = await axios.patch(`/api/users/`, body, config)
        dispatch({
            type: CHANGE_EMAIL,
            payload: res.data
        })
        dispatch(getCurrentProfile())
        history.push('/app/dashboard/profile/settings')
    } catch (err) {
        const errors = err.response.data.errors ;
        if (errors){
            dispatch(setAlert(errors[0].msg, 'danger','emailChange'))
        }
        dispatch({
            type: CHANGE_EMAIL_FAIL,
        })
    }

};
export const changePassword = (currentPassword, newPassword,  history)=> async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ currentPassword, newPassword});
    try {
        const res = await axios.patch(`/api/updatepassword`, body, config)
        dispatch({
            type: CHANGE_PASSWORD,
            payload: res.data
        })
        dispatch(logout())
    } catch (err) {
        const errors = err.response.data.errors ;
        if (errors){
            dispatch(setAlert(errors[0].msg, 'danger','changePassword'))
        }
        dispatch({
            type: CHANGE_PASSWORD_FAIL,
        })
    }

};