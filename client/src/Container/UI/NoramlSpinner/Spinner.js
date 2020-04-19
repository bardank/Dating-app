import React from 'react'
import './Spinner.css'
const Spinner = props => {
    return (
        <div className="d-flex justify-content-center">
            <div className="lds-ring"><div></div><div></div><div></div></div>
        </div>
    )
}



export default Spinner
