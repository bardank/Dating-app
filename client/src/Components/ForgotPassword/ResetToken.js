import React,{useEffect} from 'react';
import PropTypes from 'prop-types';
import {checkToken} from '../../actions/auth';
import {connect} from 'react-redux'
import Spinner from '../../Container/UI/Spinner/Spinner'


const ResetToken = ({match, history, checkToken}) => {
    useEffect(()=>{
        checkToken(match.params.token, history);
         // eslint-disable-next-line
    }, [ match.params.token])
    return (
        <Spinner/>
    )
}

ResetToken.propTypes = {
    checkToken: PropTypes.func.isRequired,
}

export default connect(null, {checkToken})(ResetToken);
