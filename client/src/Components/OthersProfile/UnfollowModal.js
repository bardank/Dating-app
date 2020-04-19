import React from 'react'
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';

const UnfollowModal = ({show, onHide, name, onUnMatch}) => {
    return (
        <Modal
        size="sm"
        show={show}
        onHide={onHide}
        aria-labelledby="example-modal-sizes-title-sm" centered
      >
        <Modal.Body>
        <h5 className='text-center font-weight-normal'>Are you sure you want to unfollow {`${name}`}?</h5>
        <button className='btn btn-danger btn-block' onClick={(e)=> onUnMatch(e)}>Yes</button>
        <button className='btn btn-secondary btn-block' onClick={(e)=>onHide(e)}>No</button>
        </Modal.Body>
      </Modal>
    )
}

UnfollowModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default UnfollowModal;
