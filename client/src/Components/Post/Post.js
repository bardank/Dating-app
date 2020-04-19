import React, {Fragment ,useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getPost, deletePost} from '../../actions/post';
import { faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {connect} from 'react-redux';
import './Post.css';
import Comments from './Comments';
import PostItem from '../Posts/PostItem';
import Spinner from '../../Container/UI/Spinner/Spinner';
import Options from '../Posts/Options'

const Post = ({ match, getPost, history, deletePost, posts:{post, loading}, profile:{profile}}) => {
    const [showOption, setOption] = useState(false)

    useEffect(()=>{
        getPost(match.params.id)
    },[getPost, match.params.id]);


    
    const onDelete = ()=>{
        if(post.user._id === profile.user._id){
            if(window.confirm("Do you want to delete this post ?")){
                deletePost(post._id)
                return history.goBack()
            }
           
        }
    }
    const onHide= ()=>{
        setOption(false)
    }

    if(!post && loading){
        return <Spinner/>
    }
    return (
        <Fragment>
            <div className='postTab'>
            <div className='post mt-1 d-flex justify-content-center '>
            <div className='post-body text-white'>
                <FontAwesomeIcon icon={faArrowLeft} onClick={()=> history.goBack()}  className="icon float-left " style={{color:"white"}}/>
            </div>
            </div>
        {!post && !loading &&
            (
                <div className='postTab'>
                <div className='post mt-1 d-flex justify-content-center '>
                <div className='post-body text-white pt-5'>
                    <h3 className='text-white text-center mt-5'>Post not available</h3>
                </div>
                </div>
                </div>
            )
        }
        {post && !loading && 
            <>
                <PostItem postClicked={e=>setOption(true)} post={post} profile={profile} />
                <div className='post'>
                <div className='post-body mb-2 text-white'>
                 <Comments  post={post} profile={profile} />
                </div>
                </div>
                <Options show={showOption} onDelete={onDelete} myPost={post.user._id === profile.user._id ? true : false} onHide={onHide} />
            </>
        }
        
        </div>
        
        </Fragment>
    )
}

Post.propTypes = {
    posts: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}
const mapStateToProps = state =>({
    posts: state.post,
    profile: state.profile
})
export default connect(mapStateToProps, {getPost, deletePost})(Post);
