import React, {Fragment, useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import { faHeart, faPaperPlane, faTrash} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {likeComment, addReply, updateReplyLike, deleteReply} from '../../actions/post';
import {connect} from 'react-redux';
import CustomModal from'../../Container/UI/CustomModal/CustomModal'

const CommentsModal = ({show, cmntId, modalClosed, likeComment,post, ondelete, addReply,deleteReply,  profile, updateReplyLike}) => {
    const [text, setText]= useState('');
    const [comment, setComment]= useState(null);
    useEffect(()=>{
        const cmnt= post.comments.find(cmnt => cmnt._id === cmntId);
        if(cmnt){
            setComment(cmnt)
        }
        
    },[cmntId, post.comments])
    const onSubmit = (e, post_id, comment_id)=>{
        const tex = text.trim()
        if(!!tex ){
            addReply(post_id, comment_id, text)
            setText('')
        }
        
    };
    const likeComments = (e, post_id, comment_id)=>{
        if( e.currentTarget.style.color === 'red'){
            e.currentTarget.style.color = 'white';

        }
        else if(e.currentTarget.style.color === 'white'){
            e.currentTarget.style.color = 'red';

        }
        likeComment(post_id, comment_id)
    };
    const likeReplies = (e, c)=>{
        if( e.currentTarget.style.color === 'red'){
            e.currentTarget.style.color = 'white';

        }
        else if(e.currentTarget.style.color === 'white'){
            e.currentTarget.style.color = 'red';

        }
        updateReplyLike(post._id, cmntId, c)
    }
    
    const removeReply = (c)=>{
        if(window.confirm("Do you want to delete this comment?")){
           return  deleteReply(post._id, cmntId, c)
        }else{
            return null
        }
    }
    return (
        <Fragment>
            <CustomModal show={show} height='95%' bodyClass='cmt_mdl_body' modalClosed={modalClosed}>
            {
                cmntId !== null && comment !== null && show ?  
                <Fragment>
                <div className='indi_comment mb-3 ml-1' >
                    <div className='d-inline '>
                        <img src={comment.user.avatar} alt={comment.user.name} className='poster ' />
                        <h6 className='d-inline text-center ml-2'>{comment.user.name}</h6>
                        <p className='container'>{comment.text}</p>
                    </div>
                    <div className=' d-flex align-items-center justify-content-start w-100 '>
                        <span className='d-inline mx-2 ' style={{cursor:'pointer'}}>
                        <FontAwesomeIcon icon={faHeart} className={comment.likes.find(like=> profile.user._id === like.user) ?'text-red': 'text-white'} onClick={e=> likeComments(e, post._id, comment._id) } />
                        <span> {comment.likes.length > 0 ? comment.likes.length : null }</span>
                        </span>
                        {comment.user._id === profile.user._id ? 
                            <span className='d-inline mx-2 float-right' style={{cursor:'pointer'}}>
                                <FontAwesomeIcon icon={faTrash} onClick={e=> ondelete(post._id, comment._id)}  className=' text-white' />
                            </span> : null}
                    </div>
                </div>
                <div className='ml-2 w-100 replies mb-8'>
                { comment !== null && comment.replies.length > 0 ? comment.replies.map((cmnt,i)=>(
                    
                    <div className='indi_comment mb-3' key={i}>
                        <div className='d-inline '>
                            <img src={cmnt.user.avatar} alt={cmnt.user.name} className='poster ' />
                            <h6 className='d-inline text-center ml-2'>{cmnt.user.name}</h6>
                            <p className='container'>{cmnt.text}</p>
                        </div>
                        <div className=' d-flex align-items-center justify-content-start w-100 '>
                            <span className='d-inline mx-2 ' style={{cursor:'pointer'}}>
                                <FontAwesomeIcon icon={faHeart} onClick={e=> likeReplies(e, cmnt._id)} className={cmnt.likes.find(like=> profile.user._id === like.user) ?'text-red': 'text-white'}  />
                                
                            </span>
                            {cmnt.user._id === profile.user._id ? 
                                <span className='d-inline mx-2 float-right' style={{cursor:'pointer'}}>
                                    <FontAwesomeIcon icon={faTrash} onClick={e=> removeReply(cmnt._id)} className=' text-white' />
                                </span> : null}
                        </div>
                    </div>
                )) : null}                
                    </div>
                </Fragment>  : null
            }
            {comment !== null && show ?
                <>
                <div className='mx-2 d-flex align-items-center w-100' style={{position: "absolute", bottom:'5px'}}>
                    <div className='w-100'>
                    <input type="text" className="comment" value={text} onChange={e => setText(e.target.value)}/>   
                    </div>
                    <button className='btn d-inline btn-success btn-sm mr-2' style={{height:'2.1rem'}} onClick={e=>onSubmit(e, post._id, comment._id)}>
                        <span><FontAwesomeIcon icon={faPaperPlane}/></span>
                    </button>
                </div>
                
                </> :null}
        </CustomModal>
        </Fragment>
    )
}

CommentsModal.propTypes = {
    likeComment: PropTypes.func.isRequired,
    addReply:  PropTypes.func.isRequired,
    updateReplyLike: PropTypes.func.isRequired,
}

export default connect(null, {likeComment, addReply, updateReplyLike, deleteReply} )(CommentsModal);
