import React, {Fragment, useEffect} from 'react';
import { Row } from 'react-bootstrap';
import {NavLink, Route, Switch} from 'react-router-dom'
import { faUser, faFireAlt, faHome, faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {connect} from 'react-redux';
import {getPeopleAround} from '../../actions/profile';
import PropTypes from 'prop-types';
import SwipeCards from '../SwipeCard/SwipeCards';
import Posts from '../Posts/Posts';
import './Main.css';

const Main = ({getPeopleAround}) => {
    useEffect(()=>{
        getPeopleAround();
         // eslint-disable-next-line
    },[]);

    return (
        <Fragment>
            <Row nogutters="false" className="align-items-start" style={{overflow:'hidden'}}>
                <div className="col  d-block py-2 mx-3 align-items-center topBar rounded-bottom" style={{width:"100%"}}>
                    <span className="text-muted text-center d-flex justify-content-between">
                    <span className='d-md-none'>
                        <NavLink to='/app/dashboard/profile' exact activeClassName="activeLink">
                            <FontAwesomeIcon icon={faUser} className="navIcon d-inline" />
                        </NavLink>
                    </span>
                    <NavLink to='/app/dashboard' exact activeClassName="activeLink">
                        <FontAwesomeIcon icon={faHome} className="navIcon d-inline" />
                    </NavLink>
                    <NavLink to='/app/dashboard/tranding' exact activeClassName="activeLink">
                        <FontAwesomeIcon icon={faFireAlt} className="navIcon d-inline" />
                    </NavLink>
                    <span className='d-md-none'>
                        <NavLink to='/app/dashboard/matches' exact activeClassName="activeLink">
                            <FontAwesomeIcon icon={faCommentAlt} className="navIcon  " />
                        </NavLink>
                    </span>
                    </span>
                </div>
            </Row>
            <div  className='swipeBody'>
                <Switch>
                    <Route path='/app/dashboard/tranding' exact component={Posts} />
                    <Route path='/app/dashboard'  component={SwipeCards} />
                </Switch>
            </div>
        </Fragment>
    )
};

Main.propTypes = {
    getPeopleAround : PropTypes.func.isRequired,
}

export default connect(null, {getPeopleAround})(Main);
