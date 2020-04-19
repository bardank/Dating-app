import React,{useEffect} from 'react'
import PropTypes from 'prop-types';
import './DesktopNav.css';
import {connect} from 'react-redux';
import Message from '../Message/Message';
import { faHome, faClone, faHeart, faCommentAlt, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Likes from '../Likes/Likes';
import Matched from '../Matched/Matched';
import Notifications from '../Notifications/Notifications';
import Navbar from '../../Container/UI/Navbar/Navbar'
import {Link, NavLink, Switch, Route} from 'react-router-dom';
import ComponentWrapper from '../../HOC/ComponentWrapper';
import {getMatch} from '../../actions/match';
import Spinner from '../../Container/UI/Spinner/Spinner'

const DesktopNav = ({ getMatch,profile:{loading, profile}}) => {


    
    useEffect(()=>{
        getMatch()

    },[getMatch]);

    
    return (
        loading || !profile ? <Spinner /> :
        <ComponentWrapper>
        <div className="desktopNav h-100" >
            <Navbar>
                <div>
                    <Link to='/app/dashboard/profile'>
                        <img src={profile.avatar[0].image} alt={profile.user.name} className="profileLogo mx-4 " />
                    </Link>
                    <h4 className=" d-inline text-center " style={{fontWeight: "400"}}>{profile.user.name}</h4>
                </div>
                <div className='d-block d-md-none'>
                <Link to='/app/dashboard'>
                    <FontAwesomeIcon icon={faHome}  className="icon float-right " style={{color:"white"}}/>
                </Link>
                </div>
            </Navbar>
            <div className='matchBar d-flex align-items-center'>
                <NavLink className='matchBar_item' to={'/app/dashboard/matches'} exact activeClassName="activeMatch">
                    <FontAwesomeIcon icon={faClone} className="navIcon d-inline" />
                </NavLink>
                <NavLink className='matchBar_item' to='/app/dashboard/likes' exact activeClassName="activeMatch">
                    <FontAwesomeIcon icon={faHeart} className="navIcon d-inline" />
                </NavLink>
                <NavLink className='matchBar_item' to='/app/dashboard/messages'  activeClassName="activeMatch">
                    <FontAwesomeIcon icon={faCommentAlt} className="navIcon d-inline" />
                </NavLink>
                <NavLink className='matchBar_item' to='/app/dashboard/notifications'  activeClassName="activeMatch">
                    <FontAwesomeIcon icon={faBell} className="navIcon d-inline" />
                </NavLink>
            </div>
            <div className='matchBar_body'>
                <Switch>
                    <Route path='/app/dashboard/likes' exact component={Likes} />
                    <Route path='/app/dashboard/messages'  component={Message} />
                    <Route path='/app/dashboard/messages/:id'  component={Message} />
                    <Route path='/app/dashboard/matches' exact component={Matched} />
                    <Route path='/app/dashboard/notifications' exact component={Notifications} />
                    <Route path='/app/dashboard/'  component={Matched} />
                </Switch>
            </div>
            
        </div>
        </ComponentWrapper>
    )
}

DesktopNav.propTypes = {
    profile: PropTypes.object.isRequired,
    getMatch: PropTypes.func.isRequired,
}
const mapStateToProps = state=>({
    profile: state.profile
})

export default connect(mapStateToProps, {getMatch})(DesktopNav);

