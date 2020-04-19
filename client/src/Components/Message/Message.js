import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import './Message.css';
import {connect} from 'react-redux';
import {getChatList} from '../../actions/chat';
import Spinner from '../../Container/UI/Spinner/Spinner'
import moment from 'moment';

const Message = ({getChatList, chat:{chatRoomLists, loading}, profile:{profile}}) => {
    useEffect(()=>{
        getChatList()
    }, [getChatList])

    if(  chatRoomLists.length > 0 && loading){
        return <Spinner/>
    }

    return (
        <div className=" messagelist  d-block  " >
        { chatRoomLists.length > 0 ? chatRoomLists.map((listItem, i)=>{
            return  <div className='messageItem py-1' key={i}>
                    { listItem.users.map((user, j) => (
                        (user._id !== profile.user._id) ?
                        (<Link className='messageRoom' to={`/app/dashboard/messages/${user._id}`} key={j}>
                            <div className={listItem.status === false && listItem.sender !== profile.user._id ? "friend-drawer friend-drawer--onhover black" : 'friend-drawer friend-drawer--onhover '}>
                            <img src={user.avatar} alt={user.name} className="profileLogo d-inline" />
                            {listItem.status === false && listItem.sender !== profile.user._id &&
                            <span className='badge'>&bull;</span>}
                            <div className="text">
                                <h6>{user.name}</h6>
                                <p className="text-muted">{listItem.message ? listItem.message : null}</p>
                            </div>
                            <span className="time text-muted small">{moment(listItem.updatedAt).calendar()}</span>
                            </div>
                        </Link>)
                            : null
                    ))}
                        
                    </div> 
        }) : null}    
        </div>
    )
}

Message.propTypes = {
    getChatList: PropTypes.func.isRequired,
    chat : PropTypes.object.isRequired,
}
const mapStateToProps = state=>({
    chat : state.chat,
    profile: state.profile
})
export default connect(mapStateToProps, {getChatList})(Message);
