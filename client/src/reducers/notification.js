import {GET_NOTIFICATIONS, NOTIFICATIONS_ERROR} from '../actions/types';

const initialState = {
    notifications: [],
    loading: true,
    error: {}
}

export default function(state = initialState, action){
    const{type, payload} = action ;
    switch(type){
        case GET_NOTIFICATIONS:
            return{
                ...state,
                notifications: payload,
                loading: true
            }
        case NOTIFICATIONS_ERROR:
            return {
                ...state,
                error: payload ,
                loading: false
            };
    default : return state
}
}