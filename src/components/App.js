import "./LoginComponents/Signup";
import Signup from "./LoginComponents/Signup";
import './App.css'
import {AuthProvider} from "../context/AuthContext";
import {BrowserRouter as Router, Switch, Route, useHistory} from "react-router-dom";
import EditProfile from "./profileComponents/EditProfile";
import Login from "./LoginComponents/Login";
import PrivateRoute from "./LoginComponents/PrivateRoute";
import ChangeProfileEmail from "./profileComponents/ChangeProfileEmail";
import ChangeProfilePassword from "./profileComponents/ChangeProfilePassword";
import HostRoom from "./chatComponents/HostRoom";
import React, {useContext, useState} from "react";
import ChatRoom from "./chatComponents/ChatRoom";
import Dashboard from "./Dashboard";
import FriendsList from "./profileComponents/FriendsList";

const AppContext = React.createContext()
export function useApp(){
    return useContext(AppContext)
}

function App() {
    const [isDesktop, setDesktop] = useState(() => {return window.matchMedia("(min-width: 600px)").matches}) //use Context instead!!!
    const value={
        isDesktop: window.matchMedia("(min-width: 600px)").matches
    }
    return (
      <AuthProvider>
          <AppContext.Provider value={value}>
                <Router>
                        <Switch>
                            {isDesktop && <PrivateRoute exact path="/desktop" component={Dashboard}/>}
                            <PrivateRoute exact path="/" component={Dashboard}/>
                            <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
                            <PrivateRoute exact path="/edit-profile/email" component={ChangeProfileEmail}/>
                            <PrivateRoute exact path="/edit-profile/password" component={ChangeProfilePassword}/>
                            <PrivateRoute exact path="/host-room" component={HostRoom}/>
                            <PrivateRoute exact path="/chatRooms/:roomId" component={ChatRoom}/>
                            <PrivateRoute exact path="/friends" component={FriendsList}/>
                            <Route path="/signup" component={Signup}/>
                            <Route path="/login" component={Login}/>
                        </Switch>
                </Router>
          </AppContext.Provider>
      </AuthProvider>


  )


}

export default App;
