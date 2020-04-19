import React, {useState } from 'react';
import { faTimes, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  Carousel } from 'react-bootstrap';
import moment from 'moment';
import {connect} from 'react-redux';
import {filterPeople} from '../../actions/profile';
import {updateMatch} from '../../actions/match';
import PropTypes from 'prop-types';
import Swipeable from "react-swipy";
import "./SwipeCards.css";
import ShowMoreText from 'react-show-more-text';


const SwipeCard = ({profiles, filterPeople, updateMatch}) => {
    const [showMore, setShowMore]= useState(false)

    const onSwipe = async(e, id)=>{
        if(e==='right'){
            return updateMatch(id)
        }
    }

    const onAfterSwipe = async(profile)=>{
       return filterPeople(profile)
        
    };

    
    
    return (
        <div className="cardboard effect "  >
            <div className="cardContainer "  >
            {profiles !== null ? 
                profiles.map((profile, i)=>(
                <div className='swipe-card ' key={i}>
                    <Swipeable key={i} min='200' 
                    buttons={({left, right}) => (
                        
                            <div className="card-info text-center ">
                                <div className='d-inline'>
                                    <span className="float-left icon-bg ml-2 mb-2">
                                        <FontAwesomeIcon onClick={left} icon ={faTimes} className="align-middle times"/>
                                    </span>
                                    <span className="float-right icon-bg mr-2 mb-2">
                                        <FontAwesomeIcon onClick={right} icon ={faHeart} className="align-middle heart"/>
                                    </span>
                                </div>
                                
                            </div> 
                    )}
                    onSwipe={(e)=> onSwipe(e, profile._id)}
                    onAfterSwipe={e=> onAfterSwipe(profile.user._id)}
                    >
                        <div className="swipeCards shadow3 "   >
                           
                            <Carousel indicators={true} interval={null} touch={false}>
                                <Carousel.Item>
                                    <img src={profile.avatar[0].image} alt='cardImage' className="card-image" /> 
                                </Carousel.Item>
                                { profile.photos && profile.photos.length > 0 ? profile.photos.map((photo, i) =>(
                                <Carousel.Item key={i}>
                                    <img src={photo.image} alt='cardImage' className="card-image" /> 

                                </Carousel.Item>
                                )): null}
                       
                            </Carousel>
                            <div className="card-info text-center ">
                                <h1 className='d-inline'>{profile.user.name} {moment().diff(profile.user.birthdate, 'years',false)}</h1>
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
                            </div> 
                        </div>
                    </Swipeable> 
                </div>
                )
            
            )
            : <h1>no cards</h1>}
            </div>
            
            
        </div>
    )
};
SwipeCard.propTypes = {
    profiles : PropTypes.array,
    filterPeople: PropTypes.func.isRequired,
    updateMatch: PropTypes.func.isRequired
};

const mapStateToProps = state =>({
    profiles: state.profile.profiles,
});


export default connect(mapStateToProps, {filterPeople, updateMatch})(React.memo(SwipeCard));
