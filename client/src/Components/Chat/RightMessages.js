import React from 'react'
import moment from 'moment';

const RightMessages = ({message}) => {
    return (
        <li  >
            <div className=' right-msg '>
                <div className='mr-2 message-text-right float-right '>
                <div className="received_withd_msg">
                <p>{message.message}</p>
                <span className='time_date'>{moment((message.createdAt)).calendar()}</span>
                </div>
                </div>
            </div>
        </li>
    )
}

export default RightMessages
