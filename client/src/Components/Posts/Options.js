import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Modal} from 'react-bootstrap';

const Options = ({show , myPost, onHide, onDelete, onReport}) => {
    const [report , setReport] = useState(false)
    const onHideClick = ()=>{
        if(report){
            setReport(false)
        }

        onHide()

    }
   
    return (
        <Modal
        size="sm"
        show={show}
        onHide={onHideClick}
         centered
      >
            <Modal.Body className='bg-dark'>
        {!report  ? 
                <div>
                {myPost &&
                    <button className='btn btn-secondary btn-block' onClick={onDelete}>Delete</button>
                }
                {!myPost &&

                    <button className='btn btn-danger btn-block' onClick={e=>setReport(true)}>Report</button>
                }
                </div>:
                <div className=' text-light reportOptns'>
                    <h5 onClick={e=> onReport(e.target.textContent)}>It's a spam</h5>
                    <h5 onClick={e=> onReport(e.target.textContent)}>It's inappropriate</h5>
                </div>}
            </Modal.Body>
            
      </Modal>
    )
}

Options.propTypes = {

}

export default Options
