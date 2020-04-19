import {GET_CHATS, CHAT_ERROR, RECEIVED_MSG, GET_CHAT_ROOM, GET_ROOM_LIST, CLEAR_CHAT, RESET_MSG_LOADING} from '../actions/types';

const initialState = {
    messages : [],
    messagesLoading: true,
    chatRoomLists: [],
    hasMore: true,
    chatRoom: null,
    receiver: null,
    loading : true,
    errors: {}
}

export default function(state = initialState, action){
    const {type, payload}= action
    switch(type){
        case RESET_MSG_LOADING:
            return{
                ...state,
                messagesLoading: true
            }
        case CLEAR_CHAT: 
        return{
            ...state,
            receiver: null,
            chatRoom: null,
            messages: [],
            messagesLoading: false,

        }
        case GET_CHAT_ROOM:
            return{
                ...state,
                receiver: payload.receiver,
                chatRoom: payload.id,
            };
        case GET_ROOM_LIST:
            return{
                ...state,
                chatRoomLists: payload,
                loading: false
            };
        case GET_CHATS:
            return{
                ...state,
                messages: [...payload , ...state.messages ],
                messagesLoading: false,
                hasMore: payload.length > 0 ? true : false
            };
        case CHAT_ERROR:
            return{
                ...state,
                errors: payload,
                loading: false
            };
        case RECEIVED_MSG: 
            return{
                ...state,
                messages: [ ...state.messages , payload ]
                // messages: state.messages.concat(payload)
            }
        default : return state;
    }
}