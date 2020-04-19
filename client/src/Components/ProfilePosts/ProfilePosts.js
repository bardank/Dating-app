import React from 'react'
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import {  Row} from 'react-bootstrap';
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';
import Spinner from '../../Container/UI/Spinner/Spinner';

const ProfilePosts = ({posts,history, scrollPosition,myProfile, userId, loading}) => {
    const onClick = (id)=>{
        if(myProfile){
            return history.push(`/app/dashboard/profile/post/${id}`)
        }else{
            return history.push(`/app/dashboard/profile/${userId}/post/${id}`)
        }
        
    }
    if(loading && posts.length === 0){
        return (
            <div className='w-100'>
            <Spinner/>
            </div>
        )
    }
    return (
        <div className='w-100 ' >
        <h2 className='text-light headingFont '>Posts</h2>
            <Row noGutters="false" style={{background: "#131517"}}>

            {posts.length !== 0 ? 
                posts.map((post,i)=>(
                    <div className="col-4" key={i}>
                        <div onClick={()=>onClick(post._id)} className="gal"> 
                        <LazyLoadImage
                            alt={post.user.name}
                            width='100%' height='100%'
                            scrollPosition={scrollPosition}
                            src={post.image}
                            className="img-fluid gallery"
                            threshold='100'
                            effect="blur"
                            delayMethod='throttle'
                            // visibleByDefault={image.src === '/landscape.jpg'} 
                            />
                        </div>          
                    </div>
                ))
            : 
                <div className="col-12" >
                    <div className="No_images d-flex justify-content-center"> 
                    <h4 className='text-center'>No Posts</h4>
                    </div>          
                </div> 
            }
            </Row>
        </div>
    )
}

ProfilePosts.propTypes = {
    loading : PropTypes.bool.isRequired,
}

export default withRouter(trackWindowScroll(ProfilePosts));
