import React,{useRef, useState, useCallback} from 'react'
import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';
import {Modal} from 'react-bootstrap';
import InputRange from 'react-input-range';
import PreviewImage from '../EditImage/PreviewImage';
import getCroppedImg from '../EditImage/CropImage';
import imageCompression from 'browser-image-compression';

const PostForm = ({show, hide}) => {
    const [img, setImg]=useState({
        imageSrc: null,
        crop: { x: 0, y: 0 },
        zoom: 0.7,
        aspect: 5/6,
        croppedAreaPixels: null,
        croppedImage: null,
        rotation: 0,
        uploadType: null, 
        formText : 'Upload an image as a post'
    });
  const {imageSrc, crop, zoom, aspect, croppedAreaPixels, croppedImage, rotation, uploadType, formText} = img ;

    const fileInput = useRef(null)
    const handelPostClick = async()=>{
        fileInput.current.click()
        setImg({...img, uploadType: 'post'})
    };
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: () => null
    }
    
    const handleFileChange = async e => {
      try {
        const currentFile = e.target.files[0] ;
        setImg({...img, formText: 'Loading Please wait'});
        const compressedFile = await imageCompression(currentFile, options);
        const reader = await imageCompression.getDataUrlFromFile(compressedFile)
        setImg({...img, imageSrc: reader, formText:'Upload an image as a post'});
      } catch (error) {
        console.log(error)
      }
    };
    const showCroppedImage = useCallback(async (e) => {
        e.preventDefault()
        try {
          const croppedImage = await getCroppedImg(
            imageSrc,
            croppedAreaPixels,
            rotation
          )
          setImg({...img, croppedImage: croppedImage });  
        } catch (e) {
          console.error(e)
        }
      }, [croppedAreaPixels, rotation, setImg, img, imageSrc ]) 
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

    const optionModal = 
    !imageSrc || imageSrc === null ? 
        (<Modal
            size="sm"
            show={show}
            onHide={(e) => hide(e)}
            centered>
            <Modal.Body className='bg-dark'>
            <input accept="image/*" type="file" className="d-none" onChange={(e) => handleFileChange(e)}
            ref={fileInput} files ="true" />
                <button className='btn btn-secondary btn-block' onClick={() => handelPostClick()}>{formText}</button>
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
        <>
        {optionModal}
        <PreviewImage show={croppedImage ? true : false} croppedImage={croppedImage} uploadType={uploadType} onHide={e=>setImg({...img, croppedImage:null})} />
        </>
    )
}

PostForm.propTypes = {
    show: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired
}

export default PostForm
