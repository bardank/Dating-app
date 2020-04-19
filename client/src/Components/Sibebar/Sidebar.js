import React, {Fragment} from 'react'
import {Route, withRouter, Switch} from 'react-router-dom';
import './Sidebar.css';
import Profile from '../Profile/Profile';
import DesktopNav from '../DesktopNav/DesktopNav';
import './Sidebar.css';

const Sidebar = (props) =>{
   
    return(
        <Fragment>
        
            <Switch >
               
                <Route path={`/app/dashboard/profile/settings`} render={(props)=>
                    <div className="d-md-block d-none justify-content-center sidebar ">
                        <Profile {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/profile/post/:id`} render={(props)=>
                    <div className="d-md-block d-none justify-content-center sidebar ">
                        <Profile {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/post/:id`} render={(props)=>
                    <div className="d-md-block d-none justify-content-center sidebar ">
                        <DesktopNav {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/profile/edit`} exact render={(props)=>
                    <div className="d-md-block d-none justify-content-center sidebar ">
                        <Profile {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/profile/post`} exact render={(props)=>
                    <div className="d-block justify-content-center sidebar ">
                        <Profile {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/profile/post/:id`} exact render={(props)=>
                    <div className="d-block justify-content-center sidebar ">
                        <Profile {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/profile`} exact render={(props)=>
                    <div className="d-block justify-content-center sidebar ">
                        <Profile {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/matches`} render={(props)=>
                    <div className="d-block justify-content-center sidebar ">
                        <DesktopNav {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/likes`} render={(props)=>
                    <div className="d-block justify-content-center sidebar ">
                        <DesktopNav {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/messages`} exact render={(props)=>
                    <div className="d-block justify-content-center sidebar ">
                        <DesktopNav {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/notifications`} exact render={(props)=>
                    <div className="d-block justify-content-center sidebar ">
                        <DesktopNav {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/message/:id`} render={props =>
                    <div className=" d-md-block d-none justify-content-center sidebar ">
                        <DesktopNav {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard`} render={props =>
                    <div className=" d-md-block d-none justify-content-center sidebar ">
                        <DesktopNav {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/profile/:profileId`} render={(props)=>
                    <div className="d-md-block d-none justify-content-center sidebar ">
                        <DesktopNav {...props} />
                    </div>
                }/>
                <Route path={`/app/dashboard/:id`} render={props =>
                    <div className="d-block d-none justify-content-center sidebar ">
                        <DesktopNav {...props} />
                    </div>
                }/>
            </Switch>
        
        </Fragment>
    )
    
};



export default withRouter(Sidebar);
