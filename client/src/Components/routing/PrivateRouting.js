import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRouting = ({component: Component, auth:{isAuthenticated, loading}, ...rest}) => (
    <Route {...rest} render={(props)=> !isAuthenticated && !loading  ? <Redirect to='/'/> : 
        (<Component {...props} />)}/>
)

PrivateRouting.propTypes = {
    auth : PropTypes.object.isRequired,
}
const mapStateToProps = (state)=>({
    auth: state.auth
})

export default connect(mapStateToProps)(PrivateRouting);
