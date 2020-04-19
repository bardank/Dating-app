import React, {Fragment, useEffect } from 'react';
import {BrowserRouter as Router , Switch, Route} from 'react-router-dom';
import Landing from './Components/Landing';
import './bootstrap.css';
import Dashboard from './Components/Dashboard/Dashboard';
import ImageUpload from './Components/ProfileSetup/ProfileSetup';
import PrivateRoute from './Components/routing/PrivateRouting' ;
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import InvalidToken from './Components/ForgotPassword/InvalidToken';
import ResetPassword from './Components/ForgotPassword/ResetPassword';
import ResetToken from './Components/ForgotPassword/ResetToken';

//redux
import {Provider} from 'react-redux';
import store from './store';
import {loadUser} from './actions/auth';
import setAuthToken from './utilis/setAthToken';

if(localStorage.token){
  setAuthToken(localStorage.token)
}

function App(props) {

  useEffect(()=>{
    store.dispatch(loadUser());
  }, [])

  return (
    <Provider store={store}>
      <Router>
      <Fragment>
        <div className="container">
        {/* <Alert/> */}
        </div>
        <Route exact path='/' component={Landing}/>
          <Switch>
            <PrivateRoute  path='/app/dashboard' component={Dashboard}/>
            <PrivateRoute exact path='/app/profilesetup' component={ImageUpload}/>
            <Route exact path='/app/forgotpassword' component={ForgotPassword}/>
            <Route exact path='/app/resettoken/:token' component={ResetToken}/>
            <Route exact path='/app/resetpassword/:token' component={ResetPassword}/>
            <Route exact path='/app/invalidtoken' component={InvalidToken}/>
            <PrivateRoute  path='/app/:id' component={Dashboard}/>
            <PrivateRoute  path='/:id' component={Dashboard}/>
            </Switch>    
      </Fragment>
    </Router>
    </Provider>
    
  );
}

export default (App);
