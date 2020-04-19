import{GET_NOTIFICATIONS, NOTIFICATIONS_ERROR} from './types';
import axios from 'axios';

export const getNotifications = ()=> async (dispatch)=>{
    
    try {
        const res = await axios.get('/api/notifications/')
        dispatch({
            type: GET_NOTIFICATIONS,
            payload: res.data
            
        })
        
    } catch (error) {
        dispatch({
            type: NOTIFICATIONS_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};