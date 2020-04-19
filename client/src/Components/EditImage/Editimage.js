import React,{Fragment, useState, useRef, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';
import {Modal} from 'react-bootstrap';
import './EditImage.css'
import InputRange from 'react-input-range';
import getCroppedImg from './CropImage';
import PreviewImage from './PreviewImage';
import imageCompression from 'browser-image-compression';

const Editimage = ({show, hideModal}) => {
  const [img, setImg]=useState({
    imageSrc: null,
    crop: { x: 0, y: 0 },
    zoom: 0.7,
    aspect: 5/6,
    croppedAreaPixels: null,
    croppedImage: null,
    rotation: 0,
    uploadType: null,
    preview: false
  });
  useEffect(()=>{
    setImg({...img, croppedImage: null, preview: false})
  }, [])
  const fileInput = useRef(null)
  const {imageSrc, crop, zoom, aspect, croppedAreaPixels, croppedImage, rotation, uploadType, preview} = img ;
  const handleProfileClick = async() => {
    fileInput.current.click()
    setImg({...img, uploadType: 'profile'})
  }

  const handelPostClick = async()=>{
    fileInput.current.click()
    setImg({...img, uploadType: 'post'})
  }
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    onProgress: () => null
  }
  const handleFileChange = async e => {
    try {
      const currentFile = e.target.files[0] ;
      const compressedFile = await imageCompression(currentFile, options);
      const reader = await imageCompression.getDataUrlFromFile(compressedFile)
      setImg({...img, imageSrc: reader});
    } catch (error) {
      console.log(error)
    }
   
  }
  // image crop 
  const onCropChange = crop => {
    setImg({...img, crop: crop })
  };
  
  const onZoomChange = zoom => {
    setImg({...img, zoom: zoom })
  };
  const onChange = e => setImg({...img, rotation: e }) ;
  
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setImg({...img, croppedAreaPixels: croppedAreaPixels })
  }, [img])


  const showCroppedImage = useCallback(async (e) => {
    e.preventDefault()
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      )
      setImg({...img, croppedImage: croppedImage,  preview: true });  
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation, setImg, img, imageSrc ]) 

  
  
  const optionModal = 
    !imageSrc || imageSrc === null ? 
        (<Modal size="sm" show={show} onHide={hideModal} aria-labelledby="example-modal-sizes-title-sm" centered>
        <Modal.Header >
          <Modal.Title id="example-modal-sizes-title-sm">
            Please Select
          </Modal.Title>
        </Modal.Header>
        <input accept="image/*" type="file" className="d-none" onChange={(e) => handleFileChange(e)}
        ref={fileInput} files ="true" /> 
        <Modal.Body>
          <div className='w-100 h-100'>
            <div className='w-100 options' onClick={() => handleProfileClick()}><button className='w-100 h-100' >Upload as Profile Picture</button></div>
            <div className="w-100 options" onClick={() => handelPostClick()}><button className='w-100 h-100' >Upload as Public Post</button></div>
          </div>
        </Modal.Body>
      </Modal>)
    : 
      (<Modal show={show}
        onHide={e=>setImg({...img, imageSrc: null})}
        dialogClassName=" custom-dialog "
        aria-labelledby="example-custom-modal-styling-title" scrollable={true} >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Edit Image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='custom-dialog w-100 h-100'>
          <div className='cropImage'>
            <div className='container '>
              <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              rotation={rotation} restrictPosition={false}
              onCropChange={e=> onCropChange(e)}
              onCropComplete={onCropComplete}
              onZoomChange={e=> onZoomChange(e)}/>
            
            </div>
          </div>
          <div>
          <InputRange 
            maxValue={360}
            minValue={0}
            value={rotation}
            onChange={e => onChange(e)}
            onChangeComplete={e => onChange(e)} />
          <InputRange 
          maxValue={5}
          minValue={0.7}
          step={0.001}
          value={zoom}
          onChange={e =>setImg({...img, zoom: e })}
          onChangeComplete={e => setImg({...img, zoom: e })} 
          />
          
          </div>
        </Modal.Body>
        <button type='button' onClick={showCroppedImage} className='btn btn-warning'>Preview</button>
      </Modal>);


    return (
      <Fragment>
        {optionModal}
        <PreviewImage show={(croppedImage === null && preview === false )? false : true  } croppedImage={croppedImage} uploadType={uploadType} onHide={e=>setImg({...img, croppedImage:null, preview: false})} />
      </Fragment>
    )
};




Editimage.propTypes = {
  show: PropTypes.bool,
  hideModal: PropTypes.func,
}

export default Editimage;