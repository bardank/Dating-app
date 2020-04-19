import axios from 'axios';
import {GET_PROFILE, PROFILE_ERROR, EDIT_PROFILE, GET_PEOPLE, PEOPLE_ERROR, FILTER_PEOPLE, GET_FRIEND_PROFILE, FRIEND_PROFILE_ERROR, CLEAR_FRIEND_PROFILE, REMOVE_PHOTO, GET_MY_POSTS, GET_MY_POSTS_ERROR} from './types';
import {setAlert} from './alert';

export const getOtherProfile = (id)=> async dispatch =>{
    dispatch({
        type: CLEAR_FRIEND_PROFILE
    })
    try {
        const res = await axios.get(`/api/profile/${id}`);
        dispatch({
            type: GET_FRIEND_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: FRIEND_PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};
export const uploadAvatar = (image, history)=> async dispatch=>{
    try {
        let config = new FormData();
        config.append('image', image);
        const img = await axios.put('/api/profile/avatar', config);
        dispatch({
            type: GET_PROFILE,
            payload: img.data
        })
        history.push('/app/dashboard')
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};
export const uploadPhoto = (image, history)=> async dispatch=>{
    try {
        let config = new FormData();
        config.append('image', image);
        const img = await axios.post('/api/profile/photos', config);
        dispatch({
            type: GET_PROFILE,
            payload: img.data
        })
        history.push('/app/dashboard')
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};
export const deletePhoto = (id)=> async dispatch =>{
    try {
        const res = await axios.delete(`/api/profile/photos/${id}`);
        dispatch({
            type: REMOVE_PHOTO,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};
export const setLocation = (latitude, longitude)=> async dispatch =>{
    const formConfig = {
        headers:{
            'Content-Type' : 'application/json'
        }
    }
    const body = JSON.stringify({longitude, latitude});
        
    try { 
        const res = await axios.post('/api/geolocation/', body, formConfig);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    }catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};
export const editProfile = (formData, history)=> async dispatch =>{
    const formConfig = {
        headers:{
            'Content-Type' : 'application/json'
        }
    }
    try { 
        const res = await axios.put('/api/profile/update', formData, formConfig);
        dispatch({
            type: EDIT_PROFILE,
            payload: res.data
        })
        history.push('/app/dashboard/profile');
    }catch (err) {
        // const errors = err.response.data.errors ;
        // if (errors){
        //     dispatch(setAlert(errors[0].msg, 'danger','profilesetup'))
        // }
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};
export const getCurrentProfile = ()=> async dispatch =>{
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};
export const createProfile = (image, history)=> async dispatch=>{
    try {
        let data = new FormData();
        data.append('image', image);
        const img = await axios.post('/api/profile/', data);
        dispatch({
            type: GET_PROFILE,
            payload: img.data
        })
        dispatch(setAlert("Image uploaded", 'success','profilesetup'))
        history.push('/app/dashboard/profile/edit')
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};
export const setPeopleAround = (minAge, maxAge, distanceRange)=> async dispatch=>{
    
        const formConfig = {
            headers:{
                'Content-Type' : 'application/json'
            }
        }
        const body = JSON.stringify({ minAge, maxAge, distanceRange});
        
    try { 
        const res = await axios.post('/api/profile/peoplearound', body, formConfig);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    }catch (err) {
        const errors = err.response.data.errors ;
        if (errors){
            dispatch(setAlert(errors[0].msg, 'danger','profilesetup'))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};
export const getPeopleAround = ()=> async dispatch =>{
    try {
        const res = await axios.get('/api/geolocation');
        dispatch({
            type: GET_PEOPLE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PEOPLE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};
export const filterPeople = (id)=> dispatch =>{
    
    dispatch({
        type: FILTER_PEOPLE,
        payload : id
    });
   
};
export const getMyPosts = ()=> async dispatch =>{
    try {
        const res = await axios.get('/api/posts/me');
        dispatch({
            type: GET_MY_POSTS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: GET_MY_POSTS_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status
            }
        })
    }
};