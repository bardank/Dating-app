import React from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'react-bootstrap'
import {connect} from 'react-redux';

const Alerts = props => 
    props.alerts !== null && props.alerts.length > 0 && props.alerts.map(alert => (
        <Alert key={alert.id} variant={alert.alertType}>
            {alert.msg}
        </Alert>
    ));


Alerts.propTypes = {
    alerts : PropTypes.array.isRequired
};

const mapStateToProps =(state)=> ({
    alerts: state.alert
})

export default connect(mapStateToProps)(Alerts);
