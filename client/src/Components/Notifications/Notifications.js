import React, {useEffect} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import './Notification.css';
import {getNotifications} from '../../actions/notification';
import moment from 'moment';

const Notifications = ({getNotifications, notification:{notifications}}) => {
    useEffect(() => {
        getNotifications()
    }, [getNotifications])
    return (
        <div className='Notification-container py-2'>
            {notifications.length > 0 && notifications.map((notif, i)=>{
                if(notif.type === 'matched' || notif.type ==='rightSwiped'){
                    return (
                        <div className='Notificaton-item px-2' key={i}>
                            <div className='d-flex'>
                            <img src='https://res.cloudinary.com/dawoq8nio/image/upload/v1585568285/zynbutaicidp3oolbcvh.jpg' alt='bardan' className="profileLogo d-inline" />
                                <div className='text'>
                                <h6>{notif.text}</h6>
                                <span className="time text-muted small">{moment(notif.createdAt).calendar()}</span>
                                </div>
                            </div>
                        </div>
                    )

                }else{
                    return (<div className='Notificaton-item px-2' key={i}>
                                <img src='https://res.cloudinary.com/dawoq8nio/image/upload/v1585568285/zynbutaicidp3oolbcvh.jpg' alt='bardan' className="notification-img d-inline" />

                            </div>)
                }
                
            })}
            <div className='Notificaton-item px-2' >
                <div className='d-flex'>
                    <img src='https://res.cloudinary.com/dawoq8nio/image/upload/v1585568285/zynbutaicidp3oolbcvh.jpg' alt='bardan' className="profileLogo d-inline" />
                    <div className='text'>
                        <h6>ssdas sdbkhkebb ansbdue asdbu adhuwhuwdhwu asjdbuw saduhuwh auhdbwu abdu dbsjb dsbdjsb euhuhd </h6>
                        <span className="time text-muted small">{moment('2020-04-10T10:31:21.142Z').calendar()}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

Notifications.propTypes = {
    notification : PropTypes.object.isRequired,
    getNotifications: PropTypes.func.isRequired,
}
const mapStateToProps = state =>({
    notification: state.notification
})
export default connect(mapStateToProps, {getNotifications})(Notifications);
