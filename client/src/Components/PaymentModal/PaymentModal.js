import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';
import './PaymentModal.css';

const PaymentModal = ({show, hide}) => {
    return (
      <Modal
        size="md"
        show={show}
        onHide={(e) => hide(e)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header >
          <Modal.Title id="example-modal-sizes-title-sm">
            Sorry for your inconvenance. <span role="img" aria-label="foldeed hands" >🙏</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='paymentModal'>
              <h5 className="text-lead">Please, wait until we add the payment option. </h5>
              <p>Till then try your luck Mate. <span role="img" aria-label="crossed fingers" >🤞</span> </p>
            </div>
        </Modal.Body>
      </Modal>
    )
}


PaymentModal.propTypes = {
    show: PropTypes.bool,
    hide: PropTypes.func.isRequired,
}

export default PaymentModal
