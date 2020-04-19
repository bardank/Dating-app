import React, { useState } from 'react'
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';
import './ImageModal.css';
import {connect} from 'react-redux';
const Modals = ({show, hide, image, auth:{user}}) => {
    return (
        <Modal
        show={show}
        onHide={e => hide(e)}
        dialogClassName=""
        aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Your Image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='custom-dialog w-100 h-100'>
        <div className='imgContainer'>
          <img src={image} alt='Cropped' className='preImg' 
          />
          </div>

          
        </Modal.Body>
      </Modal>
    )
}

Modals.propTypes = {
  show: PropTypes.bool,
  hide: PropTypes.func.isRequired,
  image: PropTypes.string,
  auth: PropTypes.object.isRequired
}
const mapStateToProps =state=> ({
  auth: state.auth
})
export default connect(mapStateToProps)(Modals);
