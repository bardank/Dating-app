import React, {Fragment ,useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect} from 'react-router-dom';
import {connect} from 'react-redux'
import { Row, Col} from 'react-bootstrap';
import './ProfileSetup.css';
import {getCurrentProfile} from '../../actions/profile';
import EditImage from './ProfileSetupModal';
import imageCompression from 'browser-image-compression';

const ImageUplaod = ({profile:{loading, profile}, getCurrentProfile}) => {
    const [img, setImg]=useState({
        image: null
    });
    const [modal, setModal]=useState(false);

    const fileInput = useRef(null)
    const {image} = img ;
    useEffect(()=>{
        getCurrentProfile()
        // eslint-disable-next-line
    }, [getCurrentProfile])

    const handleClick = async() => {
        fileInput.current.click()
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
            setImg({...img, image: reader});
            setModal(true)
        } catch (error) {
            console.log(error)
        }
        
    }

    
    const onHide = e=>{
        setModal(!modal)
    }
    if(loading === false && profile !== null ) {
        return <Redirect to="/app/dashboard/" /> 
    }
    return (
        <Fragment>
            <Row noGutters="true" className="profile-setup" >
                <Col className="bg-dark " style= {{width:"100vw", height:"100vh"}}></Col>
                <Col xs={10} md={6} className="bg-dark d-flex align-items-center" style= {{width:"100vw", height:"100vh", margin:'0 auto'}}>
                    <div className="text-center" style={{margin:'0 auto'}}>
                    <h1 className="text-warning d-block my-3 font-weight-normal text-center">Setup your profile</h1>
                    <div className="text-center d-block wrapper my-4  ">
                        <input
                            accept="image/*"
                            type="file"
                            className="d-none"
                            onChange={(e) => handleFileChange(e)}
                            ref={fileInput} 
                            files ="true"
                        /> 
                        <div className="imgUpload d-flex align-items-center"  onClick={() => handleClick()}> 
                            <p style={{margin: '0 auto'}}>click here to upload</p>
                        </div>
                        
                        <p className="lead my-3 text-muted">*Profile picture is required</p>    
                    </div>
                    </div>
                </Col>
                <Col className="bg-dark" style= {{width:"100vw", height:"100vh"}}></Col>
            </Row>
            <EditImage show={modal} uploadType='newProfile' onHide={onHide} image={image}/>
    
        </Fragment>
    )
};

ImageUplaod.propTypes = {
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    alerts: state.alert,
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(withRouter(ImageUplaod));
