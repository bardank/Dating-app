import { GET_POSTS , POST_ERROR, UPDATE_LIKES, DELETE_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT, LIKE_COMMENT, ADD_REPLY, LIKE_REPLY, REMOVE_REPLY, CLEAR_POST, GET_OTHERS_POSTS_ERROR, GET_OTHERS_POSTS, CLEAR_OTHERS_POST, CHANGE_POST_LOADING, POST_REPOTED} from '../actions/types';

const initialState = {
    posts: [],
    othersPosts:[],
    hasMore: true,
    othersPostsLoading: true ,
    post: null,
    loading: true,
    error:{}
}

export default function(state = initialState, action){
    const {type, payload} = action;
    switch(type){
        case POST_REPOTED:
            return{
                ...state,
                posts: state.posts.filter(post=> post._id !== payload)
            }
        case CHANGE_POST_LOADING:
            return{
                ...state,
                loading: true
            }
        case CLEAR_OTHERS_POST:
            return{
                ...state,
                othersPosts:[],
                othersPostsLoading: true

            }
        case GET_OTHERS_POSTS:
            return{
                ...state,
                othersPosts: payload,
                othersPostsLoading: false ,
            }
        case GET_OTHERS_POSTS_ERROR:
            return{
                ...state,
                othersPostsLoading: false,
            }
        case CLEAR_POST:
            return {
                ...state,
                post: null,
                loading: true, 
            }
        case GET_POSTS:
            return{
                ...state,
                posts: [...state.posts, ...payload],
                hasMore: payload.length > 0 ? true : false,
                loading: false
            }
        case GET_POST:
            return{
                ...state,
                post: payload,
                loading: false
            }
        // case ADD_POST:
        //     return{
        //         ...state,
        //         posts: [payload, ...state.posts]
        //     }
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post=> post._id !== payload),
                loading: false
            }
        case POST_ERROR:
            return{
                ...state,
                error: payload,
                loading:false
            }
        case UPDATE_LIKES:
            return{
                ...state,
                posts: state.posts.map(post=>
                    post._id === payload.id ? {...post, likes: payload.likes} : post
                ),
                post : state.post !== null && state.post._id === payload.id ? {...state.post, likes: payload.likes} : state.post ,
                loading: false
            }

        case LIKE_COMMENT:
            return{
                ...state,
                posts: state.posts.map(post=>
                    post._id === payload.id ? {...post, comments: payload.comments} : post
                ),
                post: {...state.post, comments:payload.comments}
            }
        
        case ADD_COMMENT:
            return {
                ...state,
                post: {...state.post, comments: payload},
                loading: false
            }
        case ADD_REPLY:
            return {
                ...state,
                post: {...state.post, comments: payload},
                loading: false
            }
        case LIKE_REPLY:
            return {
                ...state,
                post: {...state.post, comments: payload},
                loading: false
            }
        case REMOVE_REPLY:
            return{
                ...state,
                post:{...state.post, comments: payload}
            }
                //return everything except of that payload id

        case REMOVE_COMMENT:
            return {
                ...state,
                post: {...state.post,
                    comments: state.post.comments.filter(comment=> comment._id !== payload)},
                loading: false
            }
        default:
            return state;
    }
}