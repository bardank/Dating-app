import React,{ useState } from 'react'
import {Form, Button} from 'react-bootstrap';
import {Redirect, Link} from 'react-router-dom';
import {connect} from 'react-redux'
import './signIn.css';
import PropTypes from 'prop-types';
import Alert from '../../../Container/UI/Alert/Alert';
import {login} from '../../../actions/auth';

const SignInForm = (props) => {
    const [formData, setFormData] = useState({
        email:'',
        password:'',
    });

    const {email, password} = formData;
    const onChange = e => {
        setFormData({...formData, [e.target.name] : e.target.value})
    };
    const onSubmit =  async (e) => {
        e.preventDefault();
        props.login(email, password)
    }
    if(props.isAuthenticated){
        return <Redirect to='/app/dashboard' />
    }
    return (
        <div className="signinForm">
            <h1 className="text-center text-danger font-weight-bold mb-4 ">SIGN IN</h1>

            <Form className="d-block  justify-content-center" onSubmit={e=> onSubmit(e)} >
                <Form.Group>
                    <Form.Control type="email" placeholder="Email" name="email" value={email}  onChange={e=> onChange(e)} />
                </Form.Group>
                <Form.Group >
                    <Form.Control type="password" placeholder="Password" name="password" value={password} onChange={e=> onChange(e)} />
                </Form.Group>

                <Button variant="danger" type="submit" className="btn btn-block btn-lg" >
                SignIn
                </Button>
            </Form>
            <p className="text-muted mt-2"><Link to='/app/forgotpassword'>Forget password?</Link></p>
            {props.alerts !== null && props.alerts.length > 0 && props.alerts.map(alert =>{
                if(alert.alertOn === 'signin'){
                    return (<Alert key={alert.id} />)
                }else{
                    return null
                }
            })}
            <button className="btn btn-block btn-secondary mt-2" onClick={props.switch}>Switch to SignUp</button>
        </div>
    )
}
SignInForm.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    alert: PropTypes.array,
}
const mapStateToProps = (state)=>({
    alerts : state.alert,
    isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps,{login})(SignInForm);
