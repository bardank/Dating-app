import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {Link} from 'react-router-dom';

const Settings = (props) => {
    return (
        <div className='w-100 h-100'>
            <div className='profileSetting'>
                <div className='w-100 h-100'>
                    <div className='setting-header shadow1 d-flex align-items-center ' >
                        <span className='d-inline'>
                            <Link to={props.backLink}>
                                <FontAwesomeIcon icon={faArrowLeft}  className="settingIcon float-left m-2" />
                            </Link>
                        </span>
                        <div className='d-block align-items-center w-100 text-center'>
                            <h5 className='text-white d-inline text-center '>{props.name}</h5>
                        </div>
                    </div>
                    <div className='w-100 mt-1 text-white'>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;
