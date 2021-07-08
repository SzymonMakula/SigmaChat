import PrivateRoute from './PrivateRoute'
import Dashboard from '../Dashboard'
import EditProfile from '../profileComponents/EditProfile'
import ChangeProfileEmail from '../profileComponents/ChangeProfileEmail'
import ChangeProfilePassword from '../profileComponents/ChangeProfilePassword'
import HostRoom from '../chatComponents/HostRoom'
import ChatRoom from '../chatComponents/ChatRoom'
import FriendsList from '../profileComponents/FriendsList'
import React from 'react'

export default function MobileRoutes() {
    return (
        <>
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            <PrivateRoute
                exact
                path="/edit-profile/email"
                component={ChangeProfileEmail}
            />
            <PrivateRoute
                exact
                path="/edit-profile/password"
                component={ChangeProfilePassword}
            />
            <PrivateRoute exact path="/host-room" component={HostRoom} />
            <PrivateRoute
                exact
                path="/chatRooms/:roomId"
                component={ChatRoom}
            />
            <PrivateRoute exact path="/friends" component={FriendsList} />
        </>
    )
}
