import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const MatchPopup = ({content, onClick, _id}) => {
    return (
        <Fragment>
            <h1 className='text-center headingFont'>Congratulations!! </h1>
            <h2 className='text-center headingFont mt-2'>It's a Match !</h2>
            <h5 className='text-center headingFont mt-3'>{content.receiver.find(users => users._id !== _id).name} liked you too.. </h5>
            <div className="profile text-center mt-5 pb-2">
                    <img src={content.receiver.find(users => users._id === _id).avatar} className="mr-1 matched_notify_img" alt={_id} />
                    <img src={content.receiver.find(users => users._id !== _id).avatar} className="mr-1 matched_notify_img" alt={_id} k/>
                <div className='matched_not_icon'>
                <FontAwesomeIcon icon={faHeart} />
                </div>
            </div>
            
                
                <div className='w-100 mt-5 d-flex justify-content-center'>
                    <button onClick={e=> onClick(content.receiver.find(users => users._id !== _id)._id)} className='btn btn-lg btn-secondary'>Send Message</button>
                </div>
        </Fragment>
    )
}

MatchPopup.propTypes = {
    content: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default MatchPopup
