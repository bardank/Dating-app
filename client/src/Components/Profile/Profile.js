import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import { Row, Col } from 'react-bootstrap';
import InputRange from 'react-input-range';
import { faInfoCircle, faPen, faArrowLeft, faCamera, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from 'moment';
import {setPeopleAround} from '../../actions/profile'
import "react-input-range/lib/css/index.css";
import Navbar from '../../Container/UI/Navbar/Navbar';
import EditImage from '../../Components/EditImage/Editimage';
import FeaturePhotos from '../FeaturePhotos/FeaturePhotos';
import './Profile.css';
import ShowMoreText from 'react-show-more-text';
import {getMyPosts} from '../../actions/profile';
import ProfilePosts from '../ProfilePosts/ProfilePosts';

const Profile = ({getMyPosts, profile:{profile, myPosts, myPostsLoading}, setPeopleAround})=>{
    const [info, setInfo]= useState(false);
    const [showMore, setShowMore]= useState(false)
    
    const [ageRange, setAgeRange] = useState({
        minAge: 25,
        maxAge: 40,
        distanceRange: 8
    }) ;
    const {maxAge, minAge, distanceRange} = ageRange ;
    const ageValue = {min: minAge, max: maxAge};
    useEffect(()=>{
        setAgeRange({...ageRange, minAge: profile.ageBetween.minAge, maxAge: profile.ageBetween.maxAge,
            distanceRange : profile.distanceRange
        });
        getMyPosts();
        // eslint-disable-next-line
    }, [profile])
    const onChange = e =>{
        setAgeRange({...ageRange, distanceRange: e});
    };
    const onDistanceRangeComplete = e =>{
        setAgeRange({...ageRange, distanceRange: e}); 
        setPeopleAround(minAge, maxAge, distanceRange)
    };
    const onAgeRangeComplete = e=>{
        setAgeRange({...ageRange, minAge: e.min, maxAge: e.max});
        setPeopleAround(minAge, maxAge, distanceRange)
    }
    
    //uplaod image
    const [editModal, setEditModal]= useState(false);
   
    const showEdit = e => setEditModal(!editModal);
    return (
        <Row  noGutters="false" style={{width:"100%", height:"100%",overflowY:"scroll", overflowX:'hidden'}}>
            
            
            <Col xs={12} className="justify-content-start" >
                <Navbar>
                    <div className='w-100'>
                    <Link to='/app/dashboard'>
                        <FontAwesomeIcon icon={faArrowLeft}  className="icon float-left m-2" style={{color:"white"}}/>
                    </Link>
                    <Link to='/app/dashboard/profile/settings'>
                        <FontAwesomeIcon icon={faSlidersH}  className="icon float-right m-2" style={{color:"white"}}/>
                    </Link>
                    </div>
                </Navbar>
                <div className="profile text-center">
                    <img src={profile.avatar[0].image} className=" img" alt={profile.user.name} />
                <h4 className="text-white lead my-3 ">{profile.user.name}</h4>
                </div>
            
                {!profile.bio ? null : <div className="bio text-white block-bg  font-weight-normal p-2 m-2 ">
                    <ShowMoreText
                        lines={3}
                        more='Show more'
                        less='Show less'
                        anchorClass='text-muted'
                        onClick={e=> setShowMore(true)}
                        expanded={showMore}
                        keepNewLines = {true}
                        width={280}>
                        {profile.bio}
                    </ShowMoreText>
                </div>}
                <span className="d-flex justify-content-between mx-2 my-3 ">
                    <FontAwesomeIcon icon={faInfoCircle} onClick={e=> setInfo(!info)} className="icon d-inline" />
    
                    <FontAwesomeIcon icon={faCamera} onClick={e=>showEdit(e)}  className="icon d-inline" />

                        <Link to='/app/dashboard/profile/edit'>
                        <FontAwesomeIcon icon={faPen}  className="icon d-inline" />
                    </Link>
                </span>
                
                {info && 
                    <div className="text-light  block-bg profile-info py-2 mb-2">
                        <div className="container  ">
                            <div className="py-3">
                                <h6 className="text-light font-weight-normal d-inline">Age</h6>
                                <p className=" float-right">{moment().diff(profile.user.birthdate, 'years',false)}</p>
                            </div>
                            
                            <div className="py-3">
                                <h6 className="font-weight-normal">Email</h6>
                                <p className="text-muted ">{profile.user.email}</p>
                            </div>
                            <div className="py-3">
                                <h6 className="font-weight-normal d-inline">Interested in</h6>
                                <p className=" float-right">{profile.interestedIn ? profile.interestedIn : 'Please Setup Your profile' }</p>
                            </div>
                            <div className="py-2">
                                <h6 className="text-light font-weight-normal d-inline">People around</h6>
                                <p className=" float-right">{distanceRange} km</p>
                                <InputRange 
                                    maxValue={200}
                                    minValue={5}
                                    value={distanceRange}
                                    onChange={e => onChange(e)}
                                    onChangeComplete={e => onDistanceRangeComplete(e)} />
                            </div>
                            <div className="py-2">
                                <div className="range-container">
                                    <h6 className="text-light font-weight-normal d-inline">Age between</h6>
                                    <p className=" float-right">{minAge} - {maxAge}</p>
                                    <InputRange
                                        draggableTrack
                                        maxValue={51}
                                        minValue={18}
                                        onChange={e => setAgeRange({...ageRange, minAge: e.min, maxAge: e.max})}
                                        onChangeComplete={e => onAgeRangeComplete(e)}
                                        value={ageValue} />
                                </div>
                            </div> 
                        </div> 
                    </div> 
                }
            
            <Row noGutters="false" className='ml-1 mb-2'>
                <FeaturePhotos profile={profile} myProfile={true}/>
            </Row>
            <Row noGutters="false" className='ml-1 mb-2'>
                <ProfilePosts posts={myPosts}  loading={myPostsLoading} myProfile={true}/>
            </Row>
            </Col>
            
            <EditImage show={editModal} hideModal={showEdit}/>
        </Row>
    )


}
Profile.propTypes = {
    profile: PropTypes.object.isRequired,
    setPeopleAround: PropTypes.func.isRequired
}
const mapStateToProps = state =>({
    profile: state.profile
})

export default connect(mapStateToProps, {setPeopleAround, getMyPosts})(Profile);