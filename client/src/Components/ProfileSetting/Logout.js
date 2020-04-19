import React from 'react'
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';

const Logout = ({show, onHide, logout}) => {
    return (
        <Modal
        size="sm"
        show={show}
        onHide={onHide}
        aria-labelledby="example-modal-sizes-title-sm" centered
      >
        <Modal.Body>
        <h5 className='text-center font-weight-normal'>Are you sure you want to logout ?</h5>
        <button className='btn btn-primary btn-block' onClick={logout}>Yes</button>
        <button className='btn btn-secondary btn-block' onClick={(e)=>onHide(e)}>No</button>
        </Modal.Body>
      </Modal>
    )
}

Logout.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default Logout;
