import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
import {Form,Button, Col, Row} from 'react-bootstrap';
import Alert from '../../Container/UI/Alert/Alert';
import {setAlert} from '../../actions/alert';
import {resetPass} from '../../actions/auth'

const ResetPassword = ({auth:{resetPassword, resetLoading},alerts, setAlert, history, resetPass, match}) => {
    const [formData, setFormData] =useState({
        password: '',
        password1: ''
    })
    const {password, password1} = formData;
    const onChange = e => {
        setFormData({...formData, [e.target.name] : e.target.value})
    };
    const onSubmit =  async (e) => {
        e.preventDefault();
        if(password !== password1){
            setAlert('Passwords do not match','danger', 'resetPass')
        }else{
            resetPass(password,match.params.token, history)
        }
    }

    if(resetLoading === false && resetPassword === true){
        return (
            <Row noGutters="false">
            <Col md={{ span: 6, offset: 3 }} xl={{ span: 6, offset: 3 }} style= {{width:"100vw", height:"100vh"}}>
                <div className='d-flex text-white align-items-center h-100 w-100' >
                    <div className='w-100 container'>
                        <h3>Change your password</h3>
                        <br/>
                        <Form className="d-block  justify-content-center" onSubmit={e=> onSubmit(e)} >
                            <Form.Group>
                                <Form.Control type="password" placeholder="Passsword" name="password" value={password}  onChange={e=> onChange(e)} />
                            </Form.Group>
                            <Form.Group >
                                <Form.Control type="password" placeholder="Confirm Password" name="password1" value={password1} onChange={e=> onChange(e)} />
                            </Form.Group>

                            <Button variant="danger" type="submit" className="btn btn-block btn-lg" >
                                Submit
                            </Button>
                        </Form>
                        <br/>
                        {alerts !== null && alerts.length > 0 && alerts.map(alert =>{
                            if(alert.alertOn === 'resetPass'){
                                return (<Alert key={alert.id} />)
                            }else{
                                return null
                            }
                        })}
                    </div>
                </div>
            </Col>
        </Row>
        )
    }else if(resetLoading === false && resetPassword === false){
        return <Redirect to='/app/invalidtoken' />
    }
    else{
        return <Redirect to='/app/dashboard/app' />
    }

    
}

ResetPassword.propTypes = {
    auth: PropTypes.object.isRequired,
    alerts: PropTypes.array.isRequired,  
    setAlert: PropTypes.func.isRequired,  
    resetPass: PropTypes.func.isRequired,
};
const mapStateToProps = state=>({
    auth: state.auth,
    alerts: state.alert
})

export default connect(mapStateToProps, {setAlert, resetPass})(ResetPassword);
