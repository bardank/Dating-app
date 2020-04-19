import axios from 'axios';
import {GET_CHATS, CHAT_ERROR, RECEIVED_MSG, GET_CHAT_ROOM, GET_ROOM_LIST, CLEAR_CHAT, RESET_MSG_LOADING} from './types';

export const getChatList = () => async(dispatch)=>{
    try {
        const res = await axios.get(`/api/chat/list`);
        dispatch({
            type: GET_ROOM_LIST,
            payload: res.data
        })
        
       
    } catch (error) {
        dispatch({
            type: CHAT_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};
export const getMessages = (id, page) => async(dispatch)=>{
    if(parseInt(page) ==1){
        dispatch({
            type: CLEAR_CHAT,
        })
    }
    else{
        dispatch({
            type: RESET_MSG_LOADING,
        })
    }
    try {
        const res = await axios.get(`/api/chat/${id}/?page=${page}`);
        dispatch({
            type: GET_CHAT_ROOM,
            payload: {id : res.data[1]._id, receiver: res.data[1]}
        })
        dispatch({
            type: GET_CHATS,
            payload: res.data[0]
        })
       
    } catch (error) {
        dispatch({
            type: CHAT_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};

export const msgReceived = (data)=> dispatch=>{
    dispatch({
        type: RECEIVED_MSG ,
        payload: data
    })
}