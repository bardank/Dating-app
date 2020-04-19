import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';
import InputRange from 'react-input-range';
import {Modal} from 'react-bootstrap';
import getCroppedImg from '../EditImage/CropImage';
import PreviewImage from './PreviewImage';

const ProfileModal = ({show, onHide, image, uploadType}) => {
    const [img, setImg]=useState({
        crop: { x: 0, y: 0 },
        zoom: 0.4,
        aspect: 4/5 ,
        croppedAreaPixels: null,
        croppedImage: null,
        rotation: 0,
      });
    const {crop, zoom, aspect, croppedAreaPixels, croppedImage, rotation}= img ;
    const onCropChange = crop => {
        setImg({...img, crop: crop })
    };
    
    const onZoomChange = zoom => {
        setImg({...img, zoom: zoom })
    };
    const onChange = e => setImg({...img, rotation: e }) ;
    
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setImg({...img, croppedAreaPixels: croppedAreaPixels })
    }, [img]);

    const showCroppedImage = useCallback(async (e) => {
        e.preventDefault()
        try {
          const croppedImage = await getCroppedImg(
            image,
            croppedAreaPixels,
            rotation
          )
          setImg({...img, croppedImage: croppedImage });  
        } catch (e) {
          console.error(e)
        }
      }, [croppedAreaPixels, rotation, setImg, img, image ])
    return (
        <div>
            <Modal show={show}
            onHide={e=>onHide(e)}
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
                        image={image}
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
                minValue={0.4}
                step={0.001}
                value={zoom}
                onChange={e =>setImg({...img, zoom: e })} />

                </div>
                </Modal.Body>
                <button type='button' onClick={showCroppedImage} className='btn btn-warning'>Preview</button>
            </Modal>   
            <PreviewImage croppedImage={croppedImage} uploadType={uploadType} onHide={e=>setImg({...img, croppedImage:null})}/>
        </div>
    )
}

ProfileModal.propTypes = {
    show: PropTypes.bool, 
    onHide: PropTypes.func, 
    image: PropTypes.string,
    uploadType: PropTypes.string.isRequired,
}

export default ProfileModal;
