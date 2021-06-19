import "./LoginComponents/Signup";
import Signup from "./LoginComponents/Signup";
import './App.css'
import {AuthProvider} from "../context/AuthContext";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import EditProfile from "./profileComponents/EditProfile";
import Login from "./LoginComponents/Login";
import PrivateRoute from "./LoginComponents/PrivateRoute";
import ChangeProfileEmail from "./profileComponents/ChangeProfileEmail";
import ChangeProfilePassword from "./profileComponents/ChangeProfilePassword";
import HostRoom from "./chatComponents/HostRoom";
import React from "react";
import ChatRoom from "./chatComponents/ChatRoom";
import Dashboard from "./Dashboard";



function App() {


    return (
      <AuthProvider>
                <Router>
                        <Switch>
                            <PrivateRoute exact path="/" component={Dashboard}/>
                            <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
                            <PrivateRoute exact path="/edit-profile/email" component={ChangeProfileEmail}/>
                            <PrivateRoute exact path="/edit-profile/password" component={ChangeProfilePassword}/>
                            <PrivateRoute exact path="/host-room" component={HostRoom}/>
                            <PrivateRoute exact path="/chatrooms/:roomId" component={ChatRoom}/>

                            <Route path="/signup" component={Signup}/>
                            <Route path="/login" component={Login}/>
                        </Switch>
                </Router>
      </AuthProvider>


  )


}

export default App;
