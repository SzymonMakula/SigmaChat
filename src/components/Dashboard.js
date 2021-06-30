import React, {useContext, useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext";
import {useHistory} from "react-router-dom"
import Navbar from "./Navbars/Navbar";
import SearchRooms from "./chatComponents/SearchRooms";
import {database, storage} from "../firebase";

const DashContext = React.createContext()

export function useDashboard() {
    return useContext(DashContext)
}

export default function Dashboard(){
    const databaseRef = database.ref();
    const [error, setError] = useState('');
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
    }, [])




    const functions= {
        lightenWindow,
        darkenWindow,
        handleLogout,
    }


    return (
        <div className="overlay">
        <DashContext.Provider value={functions}>
            <Navbar/>
            <div className="main" style={filter} >
                <SearchRooms/>
            </div>
        </DashContext.Provider>
        </div>
    )

}

