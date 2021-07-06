import React, {useRef, useState} from "react";
import {useHistory} from "react-router-dom"
import "../../styles/Navbar.css"
import "../../styles/MainMenu.css"
import {useDashboard} from "../Dashboard";
import {useAuth} from "../../context/AuthContext";




export default function Navbar(){

    const {currentUser} = useAuth();
    const menuRef = useRef();
    const [filter, setNavFilter] = useState({filter: "grayscale(0%)"});
    const [menuStyle, setMenuStyles] = useState(
        {visibility: "hidden", width: "0%", borderRightWidth: "0"});
    const {darkenWindow, lightenWindow} = useDashboard();
    const history = useHistory();

    var prevPos;
    var curPos;
    var scheduled = null;

    const userInfo = {
        name : currentUser.displayName,
        email : currentUser.email,
        photoUrl : currentUser.photoURL,
        emailVerified : currentUser.emailVerified,
        uid :currentUser.uid
    }
    const userName = userInfo.name ? userInfo.name : userInfo.email.match(/(.+)+?@/)[1];
    const userPhoto = userInfo.photoUrl;

    function openMenu(){
        setMenuStyles({visibility: "visible", width: handleQuery(), borderRightWidth: "0.2rem"});
        setNavFilter({filter: "grayscale(100%)"})
        darkenWindow();
    }

    function closeMenu(){
        setMenuStyles({visibility: "hidden", width: "0%", borderRightWidth: "0rem"});
        setNavFilter({filter: "grayscale(0%)"})
        lightenWindow();
    }
    function handleQuery(){
        let width;
        if (window.matchMedia("(min-width: 600px)").matches) return width = "25%";
        return "85%"

    }


    function handleMove(event){
        if(!scheduled) {
            setTimeout(() => {
                curPos = event.touches[0].clientX;
                console.log(curPos, prevPos)
                if (prevPos > curPos && prevPos !== undefined) {
                    closeMenu();
                }
                scheduled = null;
            }, 120)
        }
        scheduled = event
    }

    function handleTouch(event){
        prevPos = event.touches[0].clientX;
    }


    return(
        <>
            <nav className="main-menu" ref={menuRef} style={menuStyle} onMouseLeave={() => closeMenu()}  onTouchMoveCapture={event => handleMove(event)} onTouchStart={event => handleTouch(event)}>
                <div className="profile-bar">
                    <button className="profile-picture-frame" onClick={() => history.push('/edit-profile')}>
                        <img src={userPhoto} className="profile-picture"/>
                            <h1>{userName}</h1>
                    </button>
                </div>
                <div className="menu-nav">
                    <button className="button-row" onClick={()=> history.push("/host-room")}>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus"
                                 className="svg-inline--fa fa-plus fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 448 512">
                                <path fill="currentColor"
                                      d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67
                                   0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0
                                    32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/>
                            </svg>
                        <span>Host Chatroom</span>
                    </button>
                    <button onClick={() => history.push("/friends")} className="button-row">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="users"
                             className="svg-inline--fa fa-users fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 640 512">
                            <path fill="currentColor" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"/>
                        </svg>
                        <span>Friend List</span>
                    </button>
                    <button className="button-row">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog"
                             className="svg-inline--fa fa-cog fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 512 512">
                            <path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/>
                        </svg>
                        <span>Options</span>
                    </button>
                </div>
            </nav>
            <nav className="navbar" style={filter}>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <button className="nav-link" name="SearchRooms"  onClick={()=> openMenu()} >
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars"
                                     className="svg-inline--fa fa-bars fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 448 512">
                                    <path fill="currentColor"
            d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/>
                                </svg>
                            </button>
                        </li>
                        <h2> SigmaChat</h2>
                    </ul>
                </nav>
        </>
    )
}
