import React,{useEffect, useState, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import './Posts.css';
import { faFeather } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {connect} from 'react-redux';
import {getPosts, deletePost} from '../../actions/post';
import PostItem from './PostItem';
import PostForm from './PostForm';
import Spinner from '../../Container/UI/Spinner/Spinner';
import Options from './Options.js';
import {reportPost} from '../../actions/report';

const Posts = ({getPosts, reportPost, deletePost, post:{posts, loading, hasMore}, profile:{profile}}) => {
    const [show, setShow]= useState(false);
    const [page, setPage] = useState(1);
    const [showOption, setOption] = useState({
        show: false,
        postInfo : null
    })
    const observer = useRef()
    const lastPostElRef = useCallback(
        (node) => {
            if(loading ) return 
            if( observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver(entries=>{
                if(entries[0].isIntersecting && hasMore){
                    setPage(prevPage => prevPage+1)
                }
            })
            if(node) observer.current.observe(node)
        },
        [loading, hasMore],
    )
    
    useEffect(()=>{
        getPosts(page);
        //  eslint-disable-next-line
    },[getPosts, page])

    const onOptions= (p)=>{
        setOption({show: true, postInfo: p})
    }
    const onHide= ()=>{
        setOption({show: false, postInfo: null})
    }
    const onDelete = ()=>{
        if(showOption.postInfo.user._id === profile.user._id){
            if(window.confirm("Do you want to delete this post ?")){
                 deletePost(showOption.postInfo._id)
                return setOption({show: false, postInfo: null})
            }
        }
    }
    const onReport =(e)=>{
        reportPost(showOption.postInfo._id, e)
    }
    if( posts.length === 0  && loading){
        return <Spinner/>
    }
    return (
        <div className='postsTab'>
        {posts.length && profile &&
            posts.map((post, i)=>{
                if(posts.length === i+1){
                    return (
                        <div ref={lastPostElRef} key={i}>
                            <PostItem post={post}  postClicked={()=>onOptions(post)}  profile={profile}/>
                        </div>
                    )
                }else{
                    return <PostItem post={post} postClicked={()=>onOptions(post)} key={i} profile={profile}/>
                }
                

        })
        }
        {showOption.postInfo ? <Options show={showOption.show} onReport={onReport} onDelete={onDelete}  myPost={showOption.postInfo.user._id === profile.user._id ? true : false} onHide={onHide}  />
        :null}
        {loading && hasMore && <Spinner/>}
        {!loading && !hasMore && 
            <div className='w-100 text-white text-center'>
                <p>No more posts for you</p>
            </div>
        }  
            <span className='newPost-icon' onClick={()=>setShow(!show)}>
                <FontAwesomeIcon icon={faFeather} className="feather " />
            </span>
            <PostForm show={show} hide={()=> setShow(!show)}/>
        </div>
    )
}



Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deletePost: PropTypes.func.isRequired,
};
const mapStateToProps = state =>({
    post: state.post,
    profile: state.profile
})

export default connect(mapStateToProps, {getPosts, deletePost, reportPost})(Posts);
