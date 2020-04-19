import axios from 'axios';
import {GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT, LIKE_COMMENT, LIKE_REPLY, ADD_REPLY, REMOVE_REPLY, CLEAR_POST, GET_OTHERS_POSTS, GET_OTHERS_POSTS_ERROR, CLEAR_OTHERS_POST, CHANGE_POST_LOADING, } from './types';
// import {setAlert} from './alert';


export const getPosts = (page)=> async (dispatch)=>{
    dispatch({
        type: CHANGE_POST_LOADING,
    })
    try {
        
        const res = await axios.get(`/api/posts/?page=${page}`)
        dispatch({
            type: GET_POSTS,
            payload: res.data
            
        })
        
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};

export const addLike = (id)=> async (dispatch)=>{
    try {
        const res = await axios.put(`/api/posts/like/${id}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes: res.data}
            
        }) 
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
}


export const deletePost = (id)=> async (dispatch)=>{
    try {
        await axios.delete(`/api/posts/${id}`)
        dispatch({
            type: DELETE_POST,
            payload: id
            
        })
        // dispatch(setAlert('Post Deleted', 'success'))
        
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
}

export const addPost = (image, caption, history)=> async (dispatch)=>{
    let config = new FormData();
        config.append('image', image);
        config.append('caption', caption)
    try {
        const res= await axios.post('/api/posts/', config)
        dispatch({
            type: ADD_POST,
            payload: res.data
            
        })
        // dispatch(setAlert('Post Created', 'success'))
        history.push('/app/dashboard')
        
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};
export const getPost = (id)=> async (dispatch)=>{
    dispatch({
        type: CLEAR_POST,
    })
    try {
        const res = await axios.get(`/api/posts/${id}`)
        dispatch({
            type: GET_POST,
            payload: res.data
            
        })
        
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};
export const addComment = (postId, formData)=> async (dispatch)=>{
    const config = {
        header: {
            'Content-Type' : 'application/json'
        }
    }

    try {
        const res= await axios.put(`/api/posts/comment/${postId}`, {text: formData}, config)
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
            
        })
        
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};

export const deleteComment = (postId, commentId)=> async (dispatch)=>{
    try {
        await axios.delete(`/api/posts/comment/${postId}/${commentId}`)
        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
            
        })
        
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};

export const likeComment = (postID, commentID)=> async (dispatch)=>{
    try {
        const res = await axios.put(`/api/posts/${postID}/comment/${commentID}/like`)
        dispatch({
            type: LIKE_COMMENT,
            payload: {postID, comments: res.data}
            
        }) 
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
}

export const updateReplyLike = (postID, commentID, replyID)=> async (dispatch)=>{
    try {
        const res = await axios.put(`/api/posts/${postID}/comment/${commentID}/reply/${replyID}/like`)
        dispatch({
            type: LIKE_REPLY,
            payload: res.data
            
        }) 
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
}

export const addReply = (postId, commentId,  formData)=> async (dispatch)=>{
    const config = {
        header: {
            'Content-Type' : 'application/json'
        }
    }

    try {
        const res= await axios.put(`/api/posts/${postId}/comment/${commentId}/reply`, {text: formData}, config)
        dispatch({
            type: ADD_REPLY,
            payload: res.data
            
        })
        
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};

export const deleteReply = (postId, commentID, replyID)=> async (dispatch)=>{

    try {
        const res = await axios.delete(`/api/posts/${postId}/comment/${commentID}/reply/${replyID}`)
        dispatch({
            type: REMOVE_REPLY,
            payload: res.data
            
        })
        
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};

export const getOthersPost = (id)=> async (dispatch)=>{
    dispatch({
        type: CLEAR_OTHERS_POST
    })
    try {
        const res = await axios.get(`/api/posts/user/${id}`)
        dispatch({
            type: GET_OTHERS_POSTS,
            payload: res.data
            
        })
        
    } catch (error) {
        dispatch({
            type: GET_OTHERS_POSTS_ERROR,
            payload: {msg: error.response.statusText, status: error.response.status}
        })
    }
};