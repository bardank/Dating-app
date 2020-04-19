import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import { faHeart, faPaperPlane, faCommentAlt, faTrash} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addComment} from '../../actions/post';
import {connect} from 'react-redux';
import CustomModal from './CommentsModal';
import {likeComment, deleteComment} from '../../actions/post';

const Comments = ({post, addComment, likeComment, profile, deleteComment} )=> {
    const [text, setText]= useState('');
    const [show, setShow] = useState(false);
    const [passCmnt, setCmnt] = useState(null)
    const onSubmit = (e, id)=>{
        const tex = text.trim()
        if(!!tex ){
        addComment(id, text);
        setText('')
        }
        
    };
    const onComment = (c)=>{
        setCmnt(c)
        setShow(!show)
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
    const removeComment = (post_id, comment_id)=>{
        if(window.confirm("Do you want to delete this comment?")){
            deleteComment(post_id, comment_id)
            return setShow(false)
        }else{
            return null
        }
        
    }
    return (
        <Fragment>
            <div className='ml-2 d-flex align-items-center '>
                <div className='w-100'>
                <input type="text" className="comment" value={text} onChange={e => setText(e.target.value)}/>   
                </div>
            <button className='btn d-inline btn-success btn-sm mr-2' style={{height:'2.1rem'}} onClick={e=>onSubmit(e, post._id)}>
                <span><FontAwesomeIcon icon={faPaperPlane}/></span>
            </button>
            </div>
            <div className='comment_section conatiner'>
                {post.comments.length > 0 ? 
                    post.comments.map((comment, i)=>
                    <div className='indi_comment mb-3' key={i}>
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

                            <span className='d-inline mx-2 float-right' style={{cursor:'pointer'}}>
                                <FontAwesomeIcon icon={faCommentAlt} onClick={e=> onComment(comment._id)} className=' text-white' />
                                <span> {comment.replies.length > 0 ? comment.replies.length : null }</span>
                            </span>
                            {comment.user._id === profile.user._id ? 
                            <span className='d-inline mx-2 float-right' style={{cursor:'pointer'}}>
                                <FontAwesomeIcon icon={faTrash} onClick={e=>removeComment(post._id, comment._id)} className=' text-white' />
                            </span>
                            :  null }
                        </div>
                    </div>
                    )
            : null}
            </div>
            <CustomModal cmntId={passCmnt} post={post} show={show} ondelete={removeComment} profile={profile} modalClosed={e=>setShow(!show)}/>

        </Fragment>
    )
}

Comments.propTypes = {
    addComment: PropTypes.func.isRequired,
    likeComment: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
}

export default connect(null , {addComment, likeComment, deleteComment})(Comments);
