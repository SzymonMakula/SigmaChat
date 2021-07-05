import React, {useContext, useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext";
import {BrowserRouter, Route, Router, Switch, useHistory} from "react-router-dom"
import Navbar from "./Navbars/Navbar";
import SearchRooms from "./chatComponents/SearchRooms";
import {database, storage} from "../firebase";
import ChatRoom from "./chatComponents/ChatRoom";
import EditProfile from "./profileComponents/EditProfile";
import ChangeProfileEmail from "./profileComponents/ChangeProfileEmail";
import ChangeProfilePassword from "./profileComponents/ChangeProfilePassword";
import HostRoom from "./chatComponents/HostRoom";
import FriendsList from "./profileComponents/FriendsList";

const DashContext = React.createContext()

export function useDashboard() {
    return useContext(DashContext)
}

export default function Dashboard(){
    const databaseRef = database.ref();
    const [error, setError] = useState('');
    const {currentUser, logout} = useAuth();
    const history = useHistory();
    const [isDesktop, setIsDesktop] = useState();
    const [filter, setMainFilter] = useState({filter: "grayscale(0%)"});


    async function handleLogout(){
        setError("");
        await logout().then(accept =>
            history.push("/login"),
                reject => setError(reject.message))}
    
    function darkenWindow() {
        setMainFilter({filter: "grayscale(100%)"})
    }
    function lightenWindow() {
        setMainFilter({filter: "grayscale(0%)"})
    }
    async function firstTimeUpdate(){
        await currentUser.updateProfile({
            displayName: currentUser.email.match(/(.+)+?@/)[1],
            photoURL: "https://media.discordapp.net/attachments/87143400691728384/854039271161987122/qocke2uu64571.png?width=641&height=658"
        })
        await databaseRef.child(`users/${currentUser.uid}`).set({
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
        })
    }


    useEffect(() => {
        if (!currentUser.photoURL) Promise.resolve(firstTimeUpdate())
        if (window.matchMedia("(min-width: 600px)").matches) setIsDesktop(true)
            }, [])




    const functions= {
        lightenWindow,
        darkenWindow,
        handleLogout,
    }


    return (
        <div className="overlay">
        <DashContext.Provider value={functions}>
            {isDesktop ?
                <BrowserRouter basename={"/desktop"} history={history}>
                <Navbar/>
                <div className="main" style={filter}>
                        <SearchRooms/>
                        <Switch>
                            <Route path={"/chatRooms/:roomId"} component={ChatRoom}/>
                            <Route exact path={"/edit-profile"} component={EditProfile}/>
                            <Route exact path={"/edit-profile/password"} component={ChangeProfilePassword}/>
                            <Route exact path={"/edit-profile/email"} component={ChangeProfileEmail}/>
                            <Route path={"/host-room"} component={HostRoom}/>
                            <Route path={"/friends"} component={FriendsList}/>

                        </Switch>
                </div>
                </BrowserRouter>
                :
                <>
                <Navbar/>
                    <div className="main" style={filter}>
                        <SearchRooms/>
                    </div>
                </>}
        </DashContext.Provider>
        </div>
    )

}

