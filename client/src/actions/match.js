import {GET_MATCH, MATCH_ERROR, UPDATE_MATCH, REMOVE_MATCH} from './types';
import axios from 'axios';

export const getMatch = ()=> async dispatch =>{
    try {
        const res = await axios.get('/api/match');
        dispatch({
            type: GET_MATCH,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: MATCH_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};

export const updateMatch = (id)=> async dispatch =>{
    try {
        const res = await axios.post(`/api/match/${id}`);
        dispatch({
            type: UPDATE_MATCH,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: MATCH_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};

export const unMatch = (id)=> async dispatch =>{
    try {
        const res = await axios.delete(`/api/match/${id}`);
        dispatch({
            type: REMOVE_MATCH,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: MATCH_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};