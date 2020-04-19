import React, {useState, Fragment, useRef} from 'react'
import {  Row} from 'react-bootstrap';
import './FeaturePhotos.css'
import PhotoModal from '../../Container/UI/CustomModal/CustomModal'
import {connect} from 'react-redux';
import {deletePhoto} from '../../actions/profile'
import imageCompression from 'browser-image-compression';
import EditImage from '../ProfileSetup/ProfileSetupModal';
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

const PhostosTab = ({deletePhoto, myProfile, scrollPosition ,profile:{photos, user}}) => {
    const [modal, setModal] = useState({
        show: false,
        img: null
    })
    const [fileUpload, setFileUpload] = useState({
        file: null,
        showUpload: false,
    })
    const fileInput = useRef(null)
    const {file, showUpload} = fileUpload ;
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
            setFileUpload({...fileUpload, file: reader, showUpload:true});
        } catch (error) {
            console.log(error)
        }
        
    }
    const handleClick = async() => {
        fileInput.current.click()
    }
    const onHide = ()=>{
        setFileUpload({...fileUpload, file: null, showUpload:false});
    }

    const {show, img} = modal;
    const handelModal =(e, img) =>{
        setModal({...modal, show: true, img: img})
    };
    const onDelete = (id) =>{
        if(window.confirm("Do you want to delete this feature image ?")){
                deletePhoto(id)
            return setModal({...modal, show: false, img: null})
        }else{
            return null
        }
        
    }
    
    return (
        <Fragment>
        <div className='w-100 h-100'>
        <h2 className='text-light font-weight-normal headingFont'>Feature images</h2>
            <Row noGutters="false" style={{background: "#131517"}}>
            {
                photos.length !==0 &&
                photos.map((photo,i)=>(
                    <div className="col-4" key={i}>
                        <div className="gal"> 
                        <LazyLoadImage onClick={e=> handelModal(e, photo)}
                            alt={user.name}
                            width='100%' height='100%'
                            scrollPosition={scrollPosition}
                            src={photo.image}
                            className="img-fluid gallery"
                            threshold='100'
                            effect="blur"
                            delayMethod='throttle'
                            // visibleByDefault={image.src === '/landscape.jpg'} 
                            />
                        </div>          
                    </div>
                ))
            }   
            {(photos.length === 0 && !myProfile) &&
                <div className="col-12" >
                    <div className="No_images d-flex justify-content-center"> 
                    <h4 className='text-center'>No Fetaure images</h4>
                    </div>          
                </div> 
            }
           {myProfile && photos.length < 7 ?
            <div className="col-4" >
                <div className="gal text-center" onClick={() => handleClick()}>
                    <input
                        accept="image/*"
                        type="file"
                        className="d-none"
                        onChange={(e) => handleFileChange(e)}
                        ref={fileInput} 
                        files ="true"/> 

                    <span className='add_photo'>&#10010;</span>
                </div>          
            </div>
            : null}
            </Row>
        </div>
        <PhotoModal 
            height='fit-content'
            deleteIcon={
                <span className='d-inline m-2 float-left ml-2' style={{cursor:'pointer'}}>
                    <FontAwesomeIcon icon={faTrash} onClick={e=> onDelete(img._id)} className=' text-danger ftr_del_icn'  />
                </span> 
                
            }
            bodyClass='ftr_mdl_body'
            show={ show } 
            modalClosed={e => setModal({...modal, show:false, img: null })}>
            <div className='d-block ftr_mdl_container p-1'>        
                <img  src={img ? img.image : null} alt={user.name} className='postImg' />
           
            </div>
        </PhotoModal>
        <EditImage show={showUpload} uploadType='photo' onHide={onHide} image={file} />
        </Fragment>
    )
}


export default connect(null, {deletePhoto})(trackWindowScroll(PhostosTab));
