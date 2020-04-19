import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Switch, Route} from 'react-router-dom';
import Settings from './ProfileSetting';
import Mail from './Mail'
import Password from './Password'

const SettingsRoute = props => {
    return (
        <Fragment>
            <Switch >
                <Route path={`/app/dashboard/profile/settings/mail`}  component={Mail} />
                <Route path={`/app/dashboard/profile/settings/changepassword`}  component={Password} />
                <Route path={`/app/dashboard/profile/settings`}  component={Settings} />
                
            </Switch>
        </Fragment>
    )
}


export default SettingsRoute;
