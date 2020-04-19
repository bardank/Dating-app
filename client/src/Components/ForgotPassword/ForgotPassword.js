import React,{useState} from 'react';
import PropTypes from 'prop-types';
import {Form, Col, Row} from 'react-bootstrap';
import {connect} from 'react-redux';
import {forgotPassword} from '../../actions/auth'
import Alert from '../../Container/UI/Alert/Alert';

const ForgetPassword = ({history, forgotPassword, alerts}) => {
    const [email, setEmail ]= useState('');
    const onsubmit = (e)=>(
        forgotPassword(email)
    );
    
    return (
        <Row noGutters="false">
            <Col md={{ span: 6, offset: 3 }} xl={{ span: 6, offset: 3 }} style= {{width:"100vw", height:"100vh"}}>
                <div className='d-flex text-white align-items-center h-100 w-100' >
                    <div className='w-100 container'>
                        <h3>Forgot password?</h3>
                        <br/>
                        <Form.Label>Enter your email</Form.Label>
                        <Form.Control type="email" placeholder="Email" name="email" value={email} onChange={(e)=> setEmail(e.target.value)}  />
                        <br/>
                        <button className='btn btn-primary btn-block' onClick={e=>onsubmit(e)}>Submit</button>
                        <br/>
                        {alerts !== null && alerts.length > 0 && alerts.map(alert =>{
                            if(alert.alertOn === 'forgotPass'){
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
}

ForgetPassword.propTypes = {
    forgotPassword : PropTypes.func.isRequired,
    alerts: PropTypes.array.isRequired,
}

const mapStateToProps = state =>({
    alerts : state.alert
})

export default connect(mapStateToProps, {forgotPassword})(ForgetPassword);
