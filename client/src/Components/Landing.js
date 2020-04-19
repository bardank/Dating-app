import React, {Fragment, useState} from 'react';
import { Row, Col } from 'react-bootstrap';
import SignupForm from './Auth/Signup/Signup'; 
import SignInForm from './Auth/SignIn/SignIn'; 
import {connect} from 'react-redux' ;
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types'


const Landing = (props) => {
    const [formSwitch, setFormSwitch]= useState(false);
    if(props.isAuthenticated){
        return <Redirect to='/app/dashboard' />
    }
    return (
        <Fragment>
            <Row noGutters="false" className="align-items-center" style= {{width:"100vw", height:"100vh"}}  >
                <Col className="d-md-flex d-none justify-content-center"
                    ></Col>
                <Col className="d-md-flex d-none justify-content-center" ></Col>
                <Col className="d-block justify-content-center" xs={10} md={4} >
                {formSwitch ? <SignInForm switch={()=>setFormSwitch(!formSwitch)}/> : <SignupForm switch={()=>setFormSwitch(!formSwitch)}/>}
                </Col>

            </Row>
        </Fragment>
    )
}
Landing.propTypes = {
    isAuthenticated: PropTypes.bool,
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated 

})
export default connect(mapStateToProps)(Landing) ;