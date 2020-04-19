import React, {Fragment, useState} from 'react';
import {Modal, Form} from 'react-bootstrap';
import {withRouter} from 'react-router-dom'
import {extractImageFileExtensionFromBase64, base64StringtoFile} from './base64Util';
import {uploadPhoto, uploadAvatar} from '../../actions/profile';
import {addPost} from '../../actions/post';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';


const PreviewImage = ({croppedImage, onHide, uploadPhoto, history, uploadType, uploadAvatar, addPost, show}) => {
  const [caption, setCaption] = useState('')
  const [buttonText, setButtonText] = useState('Save')
  const uploadImg= e=>{
      e.preventDefault();
      setButtonText('Uploading...')
      const fileExtension = extractImageFileExtensionFromBase64(croppedImage);
      const fileName = Date.now()+ '.' + fileExtension;
      const myFile = base64StringtoFile( croppedImage ,fileName);
      if(uploadType==='profile'){
        return uploadAvatar(myFile , history)
      }
      else if(uploadType==='feature'){
        return uploadPhoto(myFile , history);
      }
      else if (uploadType==='post' ){
        return addPost(myFile, caption, history )
      }
      
    
  };
  const onChange = (e)=>{
    setCaption(e.target.value)
  };
  return (
      <Fragment>
        <Modal show={show}
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
        {uploadType==='post' ?
        <div className='caption mx-2 my-2'><Form.Control as="textarea" placeholder='caption..' name="caption" value={caption} onChange={e=> onChange(e)} style={{resize:'none'}} rows="2" /></div>: null}
        <button onClick={uploadImg} className='btn btn-warning'>{buttonText}</button> 
        </Modal>
          
      </Fragment>
  )
}
PreviewImage.propTypes = {
  uploadPhoto: PropTypes.func.isRequired,
  onHide : PropTypes.func,
  croppedImage: PropTypes.string,
  uploadAvatar: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
}

export default connect(null, {uploadPhoto, uploadAvatar, addPost})(withRouter(PreviewImage)) ;
