import {GET_MATCH, MATCH_ERROR, UPDATE_MATCH, CLEAR_MATCH, REMOVE_MATCH} from '../actions/types';

const initialState = {
    match: [],
    loading: true,
    error: {}
}
export default function(state = initialState, action){
    const{type, payload} = action ;
    switch(type){
        case UPDATE_MATCH:
        case REMOVE_MATCH:
        case GET_MATCH:
            return {
                ...state,
                match: payload,
                loading: false,
                error: {}
            }
        case MATCH_ERROR:
            return{
                ...state,
                loading: false,
                error: payload
            }
        case CLEAR_MATCH:
            return{
                ...state,
                match: null,
                loading: true,
                error: {}

            }
    default : return state
}
}