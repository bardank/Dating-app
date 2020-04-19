import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import './Posts.css';
import { faHeart, faCommentAlt} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import { addLike} from '../../actions/post';
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';
import ShowMoreText from 'react-show-more-text';

const PostItem = ({addLike, post, profile, scrollPosition, postClicked }) => {
    const [showMore, setShowMore]= useState(false);

    const onLike = (e, id)=>{
        if( e.currentTarget.style.color === 'red'){
            e.currentTarget.style.color = 'white';

        }
        else if( e.currentTarget.style.color === 'white'){
            e.currentTarget.style.color = 'red';

        }
        addLike(id)

    };
    
    return (
        <Fragment>
        <div className='post d-flex justify-content-center mt-3'>
            <div className='post-body mb-2 text-white'>
                <div className='post-header d-flex align-items-center'>
                    <div className="d-block align-items-center  pl-2 w-100">
                        <img className='d-inline' src={post.user.avatar} alt={post.user.name} className='poster ' />
                        <Link to={`/app/dashboard/post/${post._id}`}>
                        <h5 className='d-inline text-center ml-2 text-white' style={{cursor:'pointer'}}>{post.user.name}</h5>
                        </Link>
                    </div>
                    <span className="triple_dots float-right " onClick={postClicked}></span>
                </div>
                {post.caption ? 
                    <div className='post-caption w-100  p-2 d-flex align-items-center'>
                        <ShowMoreText
                        lines={3}
                        more='Show more'
                        less='Show less'
                        anchorClass='text-muted'
                        onClick={e=> setShowMore(true)}
                        expanded={showMore}
                        keepNewLines = {true}
                        width={280}>
                        {post.caption}
                        </ShowMoreText>
                    </div>
                    :null}
                
                <div className='d-block postImg-Container'>
                    <Link to={`/app/dashboard/post/${post._id}`}>
                        <LazyLoadImage
                            alt={post.profile.name}
                            width='100%' height='100%'
                            scrollPosition={scrollPosition}
                            src={post.image}
                            className='postImg'
                            threshold='100'
                            effect="blur"
                            delayMethod='throttle'
                            // visibleByDefault={image.src === '/landscape.jpg'} 
                            />
                    </Link>
                    
                </div>
                <div className='post-footer d-flex align-items-center justify-content-between w-100 '>
                    <span className='d-inline mx-2 '>
                        <FontAwesomeIcon icon={faHeart} className={post.likes.find(like=> profile.user._id === like.user._id) ?'postLike': 'bPostLike'} onClick={(e)=>onLike(e, post._id)} />
                        <span> {post.likes.length > 0 ? post.likes.length : null}</span>
                        
                    </span>
                    <Link to={`/app/dashboard/post/${post._id}`}>
                    <span className='d-inline mx-2 float-right '>
                        <span> {post.comments.length > 0 ? post.comments.length : null} </span>
                        <FontAwesomeIcon icon={faCommentAlt} className='f2 text-white' />
                        
                    </span>
                    </Link>
                </div>
            </div>
        </div>
        </Fragment>
    )
};



PostItem.propTypes = {
    profile: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    post : PropTypes.object.isRequired
}

export default connect(null , {addLike})(trackWindowScroll(PostItem));
