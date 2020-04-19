import React, {Fragment, useEffect, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Row } from 'react-bootstrap';
import Sidebar from '../Sibebar/Sidebar';
import Spinner from '../../Container/UI/Spinner/Spinner';
import {getCurrentProfile, setLocation} from '../../actions/profile';
import './Dashboard.css';
import DashboardRoute from '../DashboardRoute/DashboardRoute';
import {Redirect} from 'react-router-dom';
import Modal from '../../Container/UI/Modal/Modal';

const Dashboard = ({getCurrentProfile, profile:{loading, profile}, setLocation, auth}) => {

    const[modal , setModal] =useState(false);
    
    const getPosition = useCallback(async(position)=>{
        try {
            setModal(false)
            setLocation(position.coords.latitude, position.coords.longitude);
            
        } catch (error) {
            console.log(error)
        }
        // eslint-disable-next-line
    },[]);

    

    useEffect(()=>{
        getCurrentProfile();

        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(getPosition, geoError);
        // } else {
        //     alert("Geolocation is not supported by this browser.");
        //     setModal(true)
        // }

        
        // eslint-disable-next-line
    }, [ ]);

    const geoError = (error)=>{
        switch(error.code) {
            case error.PERMISSION_DENIED:
            //    alert("User denied the request for Geolocation.")
            if(!loading && profile !== null){}
                setModal(true)
              break;
            case error.POSITION_UNAVAILABLE:
            //    alert("Location information is unavailable.")
                setModal(true)
               break;
            case error.TIMEOUT:
            //    alert("The request to get user location timed out.")
                setModal(true)
               break;
            case error.UNKNOWN_ERROR:
            //    alert("An unknown error occurred.")
                setModal(true)
               break;
            default:
                setModal(true)
          }
    }
    
    if(!loading && !profile && auth.user && !auth.user.avatar ){
        return  <Redirect to='/app/profilesetup' /> 
    };

    
    return (
        (loading && !profile) || (!auth.user && auth.loading) ?
            <Spinner/>:
        <Fragment>
            <Row noGutters="false" className="align-items-start " >
                <div className="justify-content-center  ">
                    <Sidebar />
                </div>
               
                <DashboardRoute />
            <Modal show={modal}>
                <p className='text-center font-weight-bold'>
                    Please turn on your location to use this app
                </p>
            </Modal>
            </Row>
        </Fragment>
    
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    setLocation: PropTypes.func.isRequired,
}
const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})
export default connect(mapStateToProps, {getCurrentProfile, setLocation})(React.memo(Dashboard));