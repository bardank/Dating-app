import React,{ useState } from 'react'
import {Form, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import './signup.css';
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import Alert from '../../../Container/UI/Alert/Alert';
import {setAlert} from '../../../actions/alert';
import {register} from '../../../actions/auth';
import moment from 'moment';

const SignupForm = (props) => {
    const date = new Date()
    date.setFullYear( date.getFullYear() - 18 );
    const [formData, setFormData] = useState({
        name: '',
        email:'',
        password:'',
        confirmPassword: '',
        birthdate:  moment(date).format("YYYY-MM-DD")
    });

    const {name, email, password, confirmPassword, birthdate} = formData;
    const onChange = e => {
        setFormData({...formData, [e.target.name] : e.target.value})
    };
    const onSubmit =  async (e) => {
        e.preventDefault();
        if(Date.parse(moment(date).format("YYYY-MM-DD")) < Date.parse(moment(birthdate).format("YYYY-MM-DD"))){
            props.setAlert('You must be above 18 years to sign up','danger',  'signup')
        }
        if(password !== confirmPassword){
            props.setAlert('Passwords do not match','danger', 'signup')
        }else{
            
            props.register({name, email, password, birthdate})
        }
    }
    if(props.isAuthenticated){
        return <Redirect to='/app/dashboard' />
    }
    return (
        <div className="signupForm ">
            <h1 className="text-center text-danger font-weight-bold mb-4 ">SIGN UP</h1>

            <Form className="d-block  justify-content-center" onSubmit={e=> onSubmit(e)} >
                <Form.Group>
                    <Form.Control type="text" placeholder="Full Name" name="name" value={name} onChange={e=> onChange(e)} />
                </Form.Group>
                <Form.Group>
                    <Form.Control type="email" placeholder="Email" name="email" value={email}  onChange={e=> onChange(e)} />
                </Form.Group>
                <Form.Group >
                    <Form.Control type="password" placeholder="Password" name="password" value={password} onChange={e=> onChange(e)} />
                </Form.Group>
                <Form.Group>
                    <Form.Control type="password" placeholder="Confirm Password" name="confirmPassword" value={confirmPassword} onChange={e=> onChange(e)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label className="text-light">Birthdate</Form.Label>
                    <Form.Control type="date" placeholder="Birthdate" name="birthdate" value={birthdate} onChange={e=> onChange(e)} />
                </Form.Group>
                
                <Button variant="danger" type="submit" className="btn btn-block btn-lg" >
                Signup
                </Button>
            </Form>
            {props.alerts !== null && props.alerts.length > 0 && props.alerts.map(alert =>{
                if(alert.alertOn === 'signup'){
                    return (<Alert key={alert.id} />)
                }else{
                    return null
                }

            })}
            <button className="btn btn-block btn-secondary mt-2" onClick={props.switch}>Switch to SignIn</button>
        </div>
    )
}
SignupForm.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}
const mapStateToProps = (state)=>({
    alerts : state.alert,
    isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps,{setAlert, register})(SignupForm);
