import {GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, EDIT_PROFILE, GET_PEOPLE, PEOPLE_ERROR, FILTER_PEOPLE, GET_FRIEND_PROFILE, FRIEND_PROFILE_ERROR, CLEAR_FRIEND_PROFILE, REMOVE_PHOTO, GET_MY_POSTS, GET_MY_POSTS_ERROR, DELETE_POST} from '../actions/types';

const initialState = {
    profile: null,
    profiles: [],
    myPosts: [],
    myPostsLoading: false,
    loading: true,
    othersProfile: null,
    loadingOther: true,
    error: {}
}
export default function(state = initialState, action){
    const{type, payload} = action ;
    switch(type){
        case DELETE_POST:
            return{
            ...state,
            myPosts: state.myPosts.length !== 0 && state.myPosts.filter(post=> post._id !== payload),
        }
        case GET_MY_POSTS_ERROR:
            return{
                ...state,
                myPostsLoading: false,
            }
        case GET_MY_POSTS:
            return{
                ...state,
                myPosts: payload,
                myPostsLoading: false
            }
        case GET_FRIEND_PROFILE: 
            return {
                ...state,
                othersProfile: payload,
                loadingOther: false,
            }
        case FRIEND_PROFILE_ERROR:
            return {
                ...state,
                othersProfile: null,
                loadingOther: false,
                error: payload
            }
        case CLEAR_FRIEND_PROFILE:
            return {
                ...state,
                othersProfile: null,
                loadingOther: true,
            }
        case FILTER_PEOPLE:
            return {
                ...state, 
                profiles: state.profiles.filter(profile => profile.user._id !== payload )
            }
        case REMOVE_PHOTO:
            return{
                ...state,
                profile: {...state.profile, photos:payload}
            }
        case EDIT_PROFILE:
        case GET_PROFILE:
            return {
                ...state,
                profile: payload ,
                loading: false
            };
        case GET_PEOPLE:
            return {
                ...state,
                profiles: payload,
                loading: false
            };
        case PEOPLE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload ,
                loading: false
            };
        case CLEAR_PROFILE:
            return{
                ...state,
                profile: null,
                profiles: [],
                loading: true,
                error: {} //my own
            }
    default : return state
}
}