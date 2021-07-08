import { Route, Switch } from 'react-router-dom'
import ChatRoom from '../chatComponents/ChatRoom'
import EditProfile from '../profileComponents/EditProfile'
import ChangeProfilePassword from '../profileComponents/ChangeProfilePassword'
import ChangeProfileEmail from '../profileComponents/ChangeProfileEmail'
import HostRoom from '../chatComponents/HostRoom'
import FriendsList from '../profileComponents/FriendsList'
import React from 'react'

export default function DesktopRoutes() {
    return (
        <Switch>
            <Route path={'/chatRooms/:roomId'} component={ChatRoom} />
            <Route exact path={'/edit-profile'} component={EditProfile} />
            <Route
                exact
                path={'/edit-profile/password'}
                component={ChangeProfilePassword}
            />
            <Route
                exact
                path={'/edit-profile/email'}
                component={ChangeProfileEmail}
            />
            <Route path={'/host-room'} component={HostRoom} />
            <Route path={'/friends'} component={FriendsList} />
        </Switch>
    )
}
