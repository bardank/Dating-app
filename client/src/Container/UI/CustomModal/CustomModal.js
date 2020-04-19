import React, {Fragment} from 'react'
import './CustomModal.css'

const CustomModal = props => {
    return (
        <Fragment>
        {props.show ? <div className='cmt_mdl_bcdrp' onClick={props.modalClosed}></div>: null} 
            <div
            className='cmt_mdl bg-dark'  style={{
                height: props.height ? props.height : null ,
                transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                opacity: props.show ? '1' : '0'
            }}>
                <div className='d-100 d-block' style={{cursor:'pointer'}}>
                    {props.deleteIcon}
                    <h5 className='float-right mr-2 mt-2' onClick={props.modalClosed}>&#10006;</h5>
                </div>
                <div className={props.bodyClass}>
                    {props.children}

                </div>
            </div>
        
        
        </Fragment>
    )
}



export default CustomModal;
