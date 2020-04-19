import React, {Fragment} from 'react';
import {Modal} from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
import {extractImageFileExtensionFromBase64, base64StringtoFile} from '../EditImage/base64Util';
import {createProfile, uploadPhoto} from '../../actions/profile';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const PreviewImage = ({croppedImage, uploadPhoto, onHide, createProfile, history, uploadType}) => {
    const uploadImg= e=>{
        e.preventDefault();
        const fileExtension = extractImageFileExtensionFromBase64(croppedImage);
        const fileName = Date.now()+ '.' + fileExtension;
        const myFile = base64StringtoFile( croppedImage ,fileName);
        if(uploadType === 'newProfile'){
          return createProfile(myFile , history);
        }
        else if(uploadType === 'photo'){
          return uploadPhoto(myFile , history);
        }
    }
    return (
        <Fragment>
        <Modal show={croppedImage === null? false : true  }
        onHide={e=>onHide(e)}
        dialogClassName=" custom-Preview "
        aria-labelledby="example-custom-modal-styling-title"  >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Edit Image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='custom-dialog w-100 h-100'>
        <div className='imgContainer'>
          <img src={croppedImage} alt='Cropped' className='preImg' />
          </div>
        </Modal.Body>
        <button onClick={uploadImg} className='btn btn-warning'>Save</button> </Modal>
            
        </Fragment>
    )
}
PreviewImage.propTypes = {
  createProfile: PropTypes.func.isRequired,
  onHide : PropTypes.func,
  croppedImage: PropTypes.string,
  uploadPhoto: PropTypes.func.isRequired,
}

export default connect(null, {createProfile, uploadPhoto})(withRouter(PreviewImage)) ;
