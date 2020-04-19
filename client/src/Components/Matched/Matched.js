import React from 'react';
import PropTypes from 'prop-types';
import {Row, Image} from 'react-bootstrap';
import {connect} from 'react-redux';
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Link} from 'react-router-dom';
import './Matched.css';

const Matched = ({match:{match:{matches}, loading}}) => {
   
    return (
        <div className="w-100 d-inline ">
            <Row style={{background: "#131517"}}  noGutters="false" className='mt-1' >
                {!loading && matches.length !== 0 ? matches.map((me, i)=>(
                    <div className="col-4" key={i}>
                        <div className="matchBox ">
                            <Link to={`/app/dashboard/profile/${me.user._id}`}>
                            <Image className="img-fluid matchImg" src={me.user.avatar} alt={me.name}/>
                            </Link>
                            <div className='match-info'>
                                <p>{me.name}</p>                       
                            </div>
                            <div className='profileIcon-msg'>
                                <Link to={`/app/dashboard/messages/${me.user._id}`}>
                                    <FontAwesomeIcon icon={faCommentAlt} className="text-white d-inline" />
                                </Link>
                            </div>
                            
                        </div>    
                    </div>
                )): <div className='text-center w-100'>No match</div>}
            </Row>
        </div>
    )
}

Matched.propTypes = {
    match: PropTypes.object.isRequired,

};

const mapStateToProps = state=>({
    match : state.match
})

export default connect(mapStateToProps)(Matched);
