import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Row } from 'react-bootstrap';
import {getOtherProfile} from '../../actions/profile';
import Spinner from '../../Container/UI/Spinner/Spinner';
import {Link} from 'react-router-dom';
import {unMatch} from '../../actions/match';
import {faArrowLeft, faInfoCircle, faHeartBroken} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import FeaturePhotos from '../FeaturePhotos/FeaturePhotos';
import UnfollowM from './UnfollowModal';
import ShowMoreText from 'react-show-more-text';
import {getOthersPost} from '../../actions/post'
import "./OthersProfile.css";
import ProfilePosts from '../ProfilePosts/ProfilePosts';

const OthersProfile = ({getOtherProfile, post:{othersPosts, othersPostsLoading }, match, getOthersPost, unMatch, profile:{othersProfile, loadingOther}}) => {
    const [showMore, setShowMore]= useState(false)
    const [info, setInfo]= useState(true);
    const [show, setShow]= useState(false);
    useEffect(()=>{
        getOtherProfile(match.params.profileId)
        getOthersPost(match.params.profileId)
    }, [getOtherProfile, match.params.profileId, getOthersPost ]);
    
    const onUnfollow = (e)=>{
        e.preventDefault();
        setShow(!show)
    };
    const onUnMatch = (id)=>{
        unMatch(id)
        setShow(!show)
    };

    if(!othersProfile && loadingOther){
        return <Spinner/>
    };
    if(!othersProfile && !loadingOther){
        return <h1 className='text-center text-dark'>Profile doesn't exists</h1>
    };
    return (
        <>
        <div className='fullPageMain pb-2'>
            <div className='post d-block justify-content-center mt-3 '>
            <div className='postNav'>
                <Link to='/app/dashboard/matches'>
                    <FontAwesomeIcon icon={faArrowLeft}  className="icon float-left m-2 postback" style={{color:"white"}}/>
                </Link>
            </div>
            <div className="profile text-center">
                <img src={othersProfile.avatar[0].image} className=" img" alt={othersProfile.user.name} />
                <h4 className="text-white lead my-3 ">{othersProfile.user.name}</h4>
            </div>
            {!othersProfile.bio ? null : <div className="bio text-white block-bg font-weight-normal p-2 m-2 "> 
                        <ShowMoreText
                        lines={3}
                        more='Show more'
                        less='Show less'
                        anchorClass='text-muted'
                        onClick={e=> setShowMore(true)}
                        expanded={showMore}
                        keepNewLines = {true}
                        width={280}>
                        {othersProfile.bio}
                    </ShowMoreText>
            </div>}
            <span className="d-flex justify-content-between mx-2 my-3 ">
                <FontAwesomeIcon icon={faInfoCircle} onClick={e=> setInfo(!info)} className="icon d-inline" />
                <FontAwesomeIcon icon={faHeartBroken} onClick={e=> onUnfollow(e)} className="icon d-inline" />
            </span>
            {info && 
                <div className="text-light  block-bg profile-info py-2 mb-2">
                    <div className="container  ">
                        <div className="py-3">
                            <h6 className="text-light font-weight-normal d-inline">Age</h6>
                            <p className=" float-right">{moment().diff(othersProfile.user.birthdate, 'years',false)}</p>
                        </div>
                        
                        <div className="py-3">
                            <h6 className="font-weight-normal d-inline">Gender</h6>
                            <p className="text-muted float-right ">{othersProfile.gender}</p>
                        </div>
                        
                    </div> 
                </div> 
            }
            <Row noGutters="false" className='ml-1'>
                <FeaturePhotos myProfile={false} profile={othersProfile}/>
            </Row>
            <Row noGutters="false" className='ml-1 mb-2'>
                <ProfilePosts posts={othersPosts} userId={match.params.profileId} loading={othersPostsLoading} myProfile={false}/>
            </Row>
            <UnfollowM show={show} name={othersProfile.user.name} onUnMatch={e=> onUnMatch(othersProfile._id)} onHide={()=>setShow(!show)}/>
            </div>
        </div>
        </>
    )
}

OthersProfile.propTypes = {
    getOtherProfile: PropTypes.func.isRequired,
    unMatch:  PropTypes.func.isRequired ,
    profile: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
}
const mapStateToProps = state=>({
    profile: state.profile,
    post: state.post
})
export default connect(mapStateToProps, {getOtherProfile, getOthersPost, unMatch})(OthersProfile);
