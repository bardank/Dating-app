import {SET_ALERT, REMOVE_ALERT, NO_ALERT} from './types';
import uuid from 'uuid';


export const setAlert = (msg, alertType, alertOn, timeOut= 5000)=> dispatch =>{
    const id = uuid.v4();
    dispatch({
        type: NO_ALERT
    });
    dispatch({
        type: SET_ALERT,
        payload : {msg, alertType, id, alertOn}
    });
    setTimeout(()=> dispatch({type:REMOVE_ALERT, payload: id}), timeOut)
};

