import React from 'react';
import { Col, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types';

const InvalidToken = props => {
    return (
        <Row noGutters="false">
            <Col md={{ span: 6, offset: 3 }} xl={{ span: 6, offset: 3 }} style= {{width:"100vw", height:"100vh"}}>
                <div className='d-flex text-white align-items-center h-100 w-100' >
                    <div className='w-100 container'>
                        <h4>
                        Reset Token is not valid or has already expired.
                        </h4>
                        <br/>
                        <p className="text-muted mt-2" >
                            <Link to='/app/forgotpassword' style={{color: 'red'}}>Send code again?</Link>
                        </p>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

InvalidToken.propTypes = {

}

export default InvalidToken
