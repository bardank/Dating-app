import axios from 'axios';
import {POST_REPOTED, REPORT_ERROR} from './types'

export const reportPost = (id, reportReason )=> async (dispatch)=>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ reportReason, onModel:'Post'});
    try {
        
        await axios.post(`/api/report/${id}`, body, config)

        dispatch({
          type : POST_REPOTED,
          payload: id
            
        })
        
    } catch (error) {
        dispatch({
            type: REPORT_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};