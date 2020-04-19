import React from 'react'
import moment from 'moment';

const LeftMessage = ({message}) => {
    return (
        <li    >
        <div className='mb-1 left-msg'>
            <div className='mx-1 d-inline '>
                <img src={message.sender.avatar} alt={message.sender.name} className='poster ' />
            </div>
            <div className="message-text">
                <div className="received_withd_msg">
                <p>{message.message}</p>
                <span className='time_date'>{moment((message.createdAt)).calendar()}</span>
                </div>
            </div>
        </div>
        </li>
    )
}



export default LeftMessage
