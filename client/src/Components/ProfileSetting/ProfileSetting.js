import React, {useState} from 'react'
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {logout} from '../../actions/auth';
import {connect} from 'react-redux';
import Logout from './Logout';
import './ProfileSettings.css';
import Settings from '../../Container/UI/Settings/Settings';

const ProfileSetting = ({logout}) => {
    const [show, setShow]= useState(false);
    const onLogout = (e)=>{
        e.preventDefault();
        setShow(!show)
    };
    return (
        <>
        <Settings backLink='/app/dashboard/profile' name='Settings'>
            <Link className='button' to='/app/dashboard/profile/settings/mail'>
            Change Email</Link>
            <Link className='button' to='/app/dashboard/profile/settings/changepassword'>Change password</Link>
            <button className='btn btn-danger btn-block'>Delete account</button>
            <br/>
            <button className='btn btn-secondary btn-block' onClick={(e)=>onLogout(e)}>Logout</button>
        </Settings>
        <Logout show={show} onHide={()=>setShow(!show)} logout={()=>logout()}/>
        </>
    )
};

ProfileSetting.propTypes = {
    logout: PropTypes.func.isRequired,
};

export default connect(null, {logout})(ProfileSetting);
