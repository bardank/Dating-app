import React, {useState, useEffect, Fragment, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import { faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Chat.css'
import io from 'socket.io-client';
import {getMessages, msgReceived} from '../../actions/chat';
import {connect} from 'react-redux';
import ScrollToBottom, { useScrollToBottom } from 'react-scroll-to-bottom';
import RightMessages from './RightMessages';
import LeftMessage from './LeftMessage';
import NoramlSpinner from '../../Container/UI/NoramlSpinner/Spinner'

let socket ;    
const MessageBox = ({match, getMessages, msgReceived, chat:{chatRoom, hasMore, messages, messagesLoading , receiver}, profile: {profile}}) => {
    const [msg, setMsg]= useState({
        value:'',
        rows: 1,

    })
    const [receiverDetail, setReceiver ] = useState(null);
    const {rows, value} = msg;
    const scrollToBottomSub = useScrollToBottom();
    const [page, setPage] = useState(1);
    const observer = useRef()
    const lastPostElRef = useCallback(
        (node) => {
            const timer = setTimeout(() => {
                if(messagesLoading  ) return 
                if( observer.current) observer.current.disconnect()
                observer.current = new IntersectionObserver(entries=>{
                if(entries[0].isIntersecting && hasMore){
                    // if(page=1){
                        // const timer = setTimeout(() => {
                            setPage(prevPage => prevPage+1)
                            console.log('last')
                        //   }, 2000);
                    // }else{
                    //     setPage(prevPage => prevPage+1)
                    //     console.log('last')
                    // }
                    
                    
                }
                
            })
            if(node) observer.current.observe(node)
            return () => clearTimeout(timer);
        }, 2000);
        },
        [messagesLoading, hasMore, page]
    )
    useEffect(()=>{
        getMessages(match.params.id, page)
        
    },[getMessages, match.params.id, page]);
    

    useEffect(()=>{
        socket = io.connect('http://localhost:5000/chat');
        if(chatRoom !== null){
            const rcvr= receiver.users.find(user => user._id !== profile.user._id);
            setReceiver(rcvr)
            
            socket.emit('join', {chatRoom, user: profile.user._id})
        }

        socket.on("message", (msg)=>{
            msgReceived(msg)
        })
        // eslint-disable-next-line

    }, [ chatRoom, msgReceived, setReceiver])
    
    const onChange = event =>{
  	    setMsg({...msg,
            value: event.target.value,
        });
    }
    const submitMsg = e =>{
        const text = value.trim()
        if(!!text ){
            e.preventDefault();
            socket.emit("sendMessage", {
                senderID: profile.user._id,
                receiverID: match.params.id,
                msg: value,
                room: chatRoom,
                type: 'text'
            })
            setMsg({...msg, value: ''})
        }
    };
    return (
        <Fragment>
            <div className='messageBox text-white shadow3'>
            {receiverDetail!== null ? 
                <div className='messgaeHeading  d-flex align-items-center'>
                <div className='ml-1'>
                    <img src={receiverDetail.avatar} alt='null' className='poster d-inline' />
                </div>
                <div className='ml-3 '>
                    <h5>{receiverDetail.name}</h5>
                </div>
            </div>
            :null}
            <ScrollToBottom useSticky={true} useMode={true} className='messgaeBody text-white d-block'   >
                <ul >
                {messagesLoading && messages.length > 0 && <NoramlSpinner/>}
                    <li id='first' ref={lastPostElRef}>
                        <div className='mb-1 left-msg' >
                        </div>
                    </li>
                {messages.length > 0 &&
                    messages.map((message, i)=>{
                    if(profile.user._id !== message.sender._id ){
                       
                        return <LeftMessage  message={message} key={message._id}/>
                    }
                    else{
                        return <RightMessages  message={message} key={message._id}/>

                    }
                    
                })}                 
                        
                    
                </ul>
            </ScrollToBottom >
            <div id="sendmessage" >
                <textarea className='input-bg' onClick={()=>scrollToBottomSub()} value={value} rows={rows} onChange={e=> onChange(e)} style={{backgroundColor :'#4a4848'}} ></textarea>
        
                <button id="send" ><span  onClick={e=> submitMsg(e)}><FontAwesomeIcon icon={faPaperPlane} className='paperPlane'/></span></button>
            </div>
        </div>
            
        </Fragment>
    )
}


MessageBox.propTypes = {
    getMessages: PropTypes.func.isRequired,
    chat : PropTypes.object.isRequired,
    msgReceived: PropTypes.func.isRequired
}
const mapStateToProps = state=>({
    chat : state.chat,
    profile: state.profile
})
export default connect(mapStateToProps, {getMessages, msgReceived})(React.memo(MessageBox));


// {messages.length !== 0 ?
//     messages.map((message, i)=>{
//     if(profile.user._id !== message.sender._id ){
//         if(i===0) {
//             return (<li  key={i} ref={lastPostElRef} >
//                         <LeftMessage message={message}/>
//                     </li>)
//         }
             
//         else{
//             return (<li  key={i} >
//                         <LeftMessage  message={message}/>
//                     </li>)
//         } 

//     }
//     else{
//         if(i===0){
//             return( <li ref={lastPostElRef} key={i} >
//                         <RightMessages  message={message}/>
//                     </li>)

//         }else{
//             return (<li key={i}>
//                         <RightMessages  message={message}/>
//                     </li>)
//         }
//     }
    
// }) : null}