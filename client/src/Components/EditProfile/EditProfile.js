import React, {Fragment, useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import { Form, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import './EditProfile.css';
import {editProfile} from '../../actions/profile';

const EditProfile = ({profile:{loading, profile}, editProfile, history}) => {
  const [editForm, setEditForm]= useState({
        jobTitle: '',
        gender: 'male',
        interestedIn: 'female',
        bio : ''
  })
  const {gender, interestedIn, bio, jobTitle }= editForm;
  useEffect(()=>{
    setEditForm({
      jobTitle:  loading || !profile.jobTitle ? '' : profile.jobTitle,
      gender: loading || !profile.gender ? 'male' : profile.gender,
      interestedIn: loading || !profile.interestedIn ? 'female' : profile.interestedIn,
      bio : loading || !profile.bio ? '' : profile.bio
    })
  },[profile, loading]);

  const onChange = e => setEditForm({...editForm, [e.target.name] : e.target.value});
  const onSubmit = async e=>{
    e.preventDefault()
    editProfile(editForm, history)
  };
  return (
    <Fragment>
        <div className="ProfileEdit ">
            <div className="header-edit bg-secondary d-flex align-items-center justify-content-center">
              <h4 className="d-inline pl-3 " style={{color:"#dad8d9"}}>Edit Info</h4>
            </div>
            <div className="editPage container w-100 h-100">
              
                  <Form className="d-block  justify-content-center" onSubmit={e=> onSubmit(e)} >
                    <Form.Group>
                      <Form.Label className="text-light lead">Bio</Form.Label>
                      <Form.Control as="textarea" name="bio" value={bio} onChange={e=> onChange(e)} className="input-bg text-muted bio_input"  rows="2" />
                    </Form.Group>
                    <Form.Group >
                      <Form.Label className="text-light  lead">Job Title</Form.Label>
                      <Form.Control className="input-bg input-bg" type="text" value={jobTitle} name="jobTitle"  onChange={e=> onChange(e)} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="text-light lead">Gender</Form.Label>
                      <select className="form-control btn-block input-bg text-muted" name="gender" value={gender} onChange={e=> onChange(e)} >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="others">Others</option>
                      </select>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="text-light lead">Interested in</Form.Label>
                      <select className="form-control btn-block input-bg text-muted" name="interestedIn" value={interestedIn} onChange={e=> onChange(e)} >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="all">All</option>
                      </select>
                    </Form.Group>
                    
                    <Button variant="danger" type="submit" className="btn btn-block btn-lg" >
                      Save
                    </Button>
                </Form>
                
            </div>
        </div>
    </Fragment>
  );
}


EditProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  editProfile: PropTypes.func.isRequired
}
const mapStateToProps = state=>({
  profile: state.profile
})
export default connect(mapStateToProps, {editProfile})(EditProfile);
