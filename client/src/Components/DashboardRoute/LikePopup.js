import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

const LikePopup = ({content, onClick, _id}) => {
    return (
        <Fragment>
        <h1 className='text-center headingFont '>Great!! </h1>
        <h2 className='text-center headingFont my-3'>{content.createdBy.name} swiped right on you.</h2>
        <div className="profile text-center my-5">
            <img src={content.createdBy.avatar} className="ml-1 matched_notify_img" alt={content.createdBy.name} />
            
        </div>
        <div className='w-100 mt-5 d-flex justify-content-center'>
            <button onClick={e=> onClick(content.createdBy._id)} className='btn btn-lg btn-primary'>View Profile</button>
        </div>
        </Fragment>
    )
}

LikePopup.propTypes = {
    content: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default LikePopup
