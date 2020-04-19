import React, {Fragment ,useEffect, useState } from 'react'
import { Route, Switch} from 'react-router-dom'
import { Col } from 'react-bootstrap';
import Main from '../Main/Main';
import EditProfile from '../EditProfile/EditProfile';
import ProfileSettings from '../ProfileSetting/SettingsRoute';
import Messsage from '../Chat/Chat';
import Post from '../Post/Post';
import OthersProfile from '../OthersProfile/OthersProfile';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import Modal from '../../Container/UI/CustomModal/CustomModal';
import './DashboardRoute.css'
import {withRouter} from 'react-router-dom';
import MatchPopup from './MatchPopup';
import LikePopup from './LikePopup';

let socket ;    

const DashboardR = ({profile, history}) => {
    const [notify, setNotify] = useState({
        show: false,
        content: null, 
    })
    const {show, content} = notify ;

    
    useEffect(()=>{
        if(profile.user._id){

            socket = io.connect('http://localhost:5000/notification');
            socket.emit('join', {_id :profile.user._id})
                
            socket.on("newMessage", (msg)=>{
                console.log(msg)
            });
            socket.on("newMatch", (msg)=>{
                console.log(msg)
                if(show){
                    setNotify({...notify, show:false, content:null})
                }
                setNotify({...notify, show:true, content:msg})
            });
        }
        // eslint-disable-next-line
    },[profile]);
    const handelModal =(e) =>{
        setNotify({...notify, show: false , content: null})
    };
    const onClick = (id)=>{
        history.push(`/app/dashboard/messages/${id}`)
        setNotify({...notify, show: false , content: null})

    };

    const viewProfile = (id)=>{
        history.push(`/app/dashboard/profile/${id}`)
        setNotify({...notify, show: false , content: null})

    };

    return (
        <Fragment>
            <Switch>
                <Route path={`/app/dashboard/post/:id`} render={(props)=><Col className="d-block main  justify-content-center"><Post {...props}/></Col>}/>
                <Route path={`/app/dashboard/messages/:id`} render={(props)=><Col className="d-block main  justify-content-center"><Messsage {...props}/></Col>}/>
                <Route path={`/app/dashboard/matches`} exact render={(props)=><Col className="d-md-block d-none main  justify-content-center" ><Main {...props}/></Col>}/>
                <Route path={`/app/dashboard/notifications`} exact render={(props)=><Col className="d-md-block d-none main  justify-content-center" ><Main {...props}/></Col>}/>
                <Route path={`/app/dashboard/likes`} exact render={(props)=><Col className="d-md-block d-none main  justify-content-center" ><Main {...props}/></Col>}/>
                <Route path={`/app/dashboard/profile`} exact render={(props)=><Col className="d-md-block d-none main  justify-content-center" ><Main {...props}/></Col>}/> 
                <Route path={`/app/dashboard/profile/post`} exact render={(props)=><Col className="d-md-block d-none main  justify-content-center" ><Main {...props}/></Col>}/>  
                <Route path={`/app/dashboard/profile/post/:id`} render={(props)=><Col className="d-block main  justify-content-center"><Post {...props}/></Col>}/>
                <Route path={`/app/dashboard/profile/settings`} render={(props)=><Col className="d-block main  justify-content-center"><ProfileSettings {...props}/></Col>}/>
                <Route path={`/app/dashboard/profile/edit`}exact render={(props)=><Col className="d-block main  justify-content-center"><EditProfile {...props}/></Col>}/>
                <Route path={`/app/dashboard/profile/:profileId`}exact render={(props)=><Col className="d-block main  justify-content-center"><OthersProfile {...props}/></Col>}/>
                <Route path={`/app/dashboard/profile/:profileId/post`}exact render={(props)=><Col className="d-block main  justify-content-center"><OthersProfile {...props}/></Col>}/>
                <Route path={`/app/dashboard/profile/:profileId/post/:id`}exact render={(props)=><Col className="d-block main  justify-content-center"><Post {...props}/></Col>}/>
                <Route path={`/app/dashboard/tranding`} render={(props)=><Col className="d-block main  justify-content-center"><Main {...props}/></Col>}/>
                <Route path={`/app/dashboard`} render={(props)=><Col className="d-block main  justify-content-center"><Main {...props}/></Col>}/>
            </Switch>
            {
                profile &&
                (<Fragment>
                <Modal show={ show }  modalClosed={e => handelModal(e)}>
                {(content && content.type === 'matched') &&
                    <MatchPopup onClick={onClick} _id={profile.user._id} content={content} />
                }
                {(content && content.type === 'rightSwiped') &&
                    <LikePopup onClick={viewProfile}  _id={profile.user._id} content={content} />
                }
                </Modal>
                </Fragment>)
            }
            
        </Fragment>
    )
}
const mapStateToProps =  state =>({
    profile: state.profile.profile
})
export default connect(mapStateToProps)(withRouter(DashboardR));
