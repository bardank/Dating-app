import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Settings from '../../Container/UI/Settings/Settings';
import {Form, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import Alert from '../../Container/UI/Alert/Alert';
import {emailChange} from '../../actions/auth';


const Mail = ({profile: {profile}, emailChange, history, alerts}) => {
    const [formData, setFormData] = useState({
        email:'',
        password:'',
    });
    const {email, password} = formData;
    const onChange = e => {
        setFormData({...formData, [e.target.name] : e.target.value})
    };
    const onClick =(e)=>{
        emailChange(email, password, history)
    }
    return (
        <>
            <Settings backLink='/app/dashboard/profile/settings' name='Change Email'>
            <h5>Your Email</h5>
            <p className='text-muted'>{profile.user.email}</p>
                <Form.Group>
                    <Form.Label>New Email</Form.Label>
                    <Form.Control type="email" placeholder="New Email" name="email" className='input-bg' value={email}  onChange={e=> onChange(e)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Your current password</Form.Label>
                    <Form.Control type="password" placeholder="Current Password" name="password" className='input-bg' value={password}  onChange={e=> onChange(e)} />
                </Form.Group>
                {alerts !== null && alerts.length > 0 && alerts.map(alert =>{
                    if(alert.alertOn === 'emailChange'){
                        return (<Alert key={alert.id} />)
                    }else{
                        return null
                    }
                })}
                <Button variant="danger" type="submit" onClick={(e)=>onClick(e)} className="btn btn-block btn-lg" >
                Save
                </Button>
            </Settings>
        </>
    )
};

Mail.propTypes = {
    profile: PropTypes.object.isRequired,
    emailChange : PropTypes.func.isRequired ,
    alert: PropTypes.array,
};
const mapStateToProps = state=>({
    profile: state.profile,
    alerts: state.alert
})

export default connect(mapStateToProps, {emailChange} )(Mail);
