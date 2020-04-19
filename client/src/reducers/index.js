import {combineReducers} from 'redux';
import alert from "./alert";
import auth from "./auth";
import profile from './profile';
import match from './match';
import post from './post';
import chat from './chat';
import notification from './notification';
export default combineReducers({
    alert,
    auth,
    profile,
    post,
    match,
    chat,
    notification
})