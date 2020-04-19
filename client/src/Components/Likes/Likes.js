import React, {useState} from 'react';
import {Row, Image} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './Likes.css';
import PaymentModal from '../PaymentModal/PaymentModal';

const Matches = ({ match:{match:{likedMe}, loading}}) => {
    const [showModal, setModal] = useState(false)

    

    const onHide = ()=>{
        setModal(!showModal)

    };
    return (
        <div className="w-100 d-inline ">
            <Row style={{background: "#131517"}}  noGutters="false" className='mt-1' >
                {!loading && likedMe.length !== 0 ? likedMe.map((me, i)=>(
                <div className="col-4" key={i}>
                    <div className="matchBox">
                    <Image className="img-fluid likeImg" onClick={()=>setModal(!showModal)}  src={me.user.avatar} alt={me.user.name}/>
                    </div>          
                </div>
                )): null}
            </Row>
        <PaymentModal  show={showModal} hide={()=>onHide()}/>
        </div>
    )
};
Matches.propTypes = {
   match: PropTypes.object.isRequired,
}
const mapStateToProps = state =>({
    match: state.match
})
export default connect(mapStateToProps)(Matches);
