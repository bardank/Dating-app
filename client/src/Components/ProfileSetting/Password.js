import React,{useState} from 'react'
import {Form, Button} from 'react-bootstrap';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Settings from '../../Container/UI/Settings/Settings';
import Alert from '../../Container/UI/Alert/Alert';
import {setAlert} from '../../actions/alert';
import {changePassword} from '../../actions/auth';

const Password = ({setAlert, alerts, history, changePassword}) => {
    const [formData, setFormData] = useState({
        currentPassword:'',
        password:'',
        password2: ''
    });
    const {currentPassword, password, password2} = formData;
    const onChange = e => {
        setFormData({...formData, [e.target.name] : e.target.value})
    };
    const onSubmit = (e)=>{
        e.preventDefault();
        if(password2 !== password){
            setAlert('New passwords do not match','danger', 'changePassword')
        }
        changePassword(currentPassword, password, history)
    }
    return (
        <>
            <Settings name='Change Password' backLink='/app/dashboard/profile/settings'>
            <Form className="d-block  justify-content-center" onSubmit={e=> onSubmit(e)} >
                <Form.Group>
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type="password" placeholder="Current" className='input-bg' name="currentPassword" value={currentPassword}  onChange={e=> onChange(e)} />
                </Form.Group>
                <Form.Group >
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" className='input-bg' name="password" value={password} onChange={e=> onChange(e)} />
                </Form.Group>
                <Form.Group >
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" placeholder="Password new password" className='input-bg' name="password2" value={password2} onChange={e=> onChange(e)} />
                </Form.Group>
                <br/>
                {alerts !== null && alerts.length > 0 && alerts.map(alert =>{
                    if(alert.alertOn === 'changePassword'){
                        return (<Alert key={alert.id} />)
                    }else{
                        return null
                    }
                })}
                <Button variant="danger" type="submit" className="btn btn-block btn-lg" >
                    Save
                </Button>
            </Form>

            </Settings>
        </>
    )
}

Password.propTypes = {
    alerts: PropTypes.array,
    setAlert: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
}
const mapStateToProps = (state)=>({
    alerts : state.alert
})
export default connect(mapStateToProps, {setAlert, changePassword})(Password);
