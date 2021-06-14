import React, {useContext, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext";
import {Route, Switch, useHistory} from "react-router-dom"
import {BrowserRouter as Router, useRouteMatch, Link} from "react-router-dom";
import Navbar from "./Navbars/Navbar";
import editProfile from "./profileComponents/EditProfile";
import SearchRooms from "./chatComponents/SearchRooms";
import PrivateRoute from "./LoginComponents/PrivateRoute";
import HostRoom from "./chatComponents/HostRoom";

const DashContext = React.createContext()

export function useDashboard() {
    return useContext(DashContext)
}

export default function Dashboard(){
    const [error, setError] = useState('');
    const [currentWindow, setCurrentWindow] = useState(null)
    const {currentUser, logout} = useAuth();
    const history = useHistory();
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




    const functions= {
        lightenWindow,
        darkenWindow,
        handleLogout,
    }


    return (

        <DashContext.Provider value={functions}>
            <Navbar/>
            <div className="main" style={filter} >
                <SearchRooms/>
                <button className="create-room-button">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus"
                         className="svg-inline--fa fa-plus fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path fill="currentColor"
                              d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67
                                   0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0
                                    32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/>
                    </svg>
                </button>
                {currentWindow}
            </div>
        </DashContext.Provider>
    )

}

