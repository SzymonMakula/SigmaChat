import React from "react";

import "./Navbar.css"
import {useDashboard} from "../Dashboard";

export default function Navbar(){

    const {createRoomWindow, createSearchTab} = useDashboard()


    return(
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <button className="nav-link" name="SearchRooms" onClick={()=> createSearchTab()} >
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search"
                             className="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 512 512">
                            <path fill="currentColor"
                                  d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1
                                   322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5
                                    12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208
                                    336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128
                                     128 0 70.7-57.2 128-128 128z"/>
                        </svg>
                        <span className="link-text">Search Rooms</span>
                    </button>
                </li>
                <li className="nav-item">
                    <button name="CreateRoomWindow" className="nav-link" onClick={() => createRoomWindow()}>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus"
                             className="svg-inline--fa fa-plus fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 448 512">
                            <path fill="currentColor"
                                  d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67
                                   0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0
                                    32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/>
                        </svg>
                        <span className="link-text">Create New Room</span>
                    </button>
                </li>
                <li className="nav-item">
                    <button className="nav-link">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="users"
                             className="svg-inline--fa fa-users fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 640 512">
                            <path fill="currentColor" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"/>
                        </svg>
                        <span className="link-text">Online Chatters</span>
                    </button>
                </li>
                <li className="nav-item">
                    <button className="nav-link">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog"
                             className="svg-inline--fa fa-cog fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 512 512">
                            <path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/>
                        </svg>
                        <span className="link-text">Options</span>
                    </button>
                </li>
            </ul>
        </nav>

    )
}

var startPos;
var currentPos;
let difference;
let size;
let newWidth = menuStyle.width.replace("%", "");
let scheduled = null;

function handleTouchStart(event){
    startPos = event.touches[0].pageX
}
function handleTouchMove(event){

    if(!scheduled){
        setTimeout(() => {
            currentPos = event.touches[0].pageX;
            difference = (currentPos - startPos)/5;
            newWidth = menuRef.current.style.width;
            newWidth = parseInt(newWidth, 10);
            newWidth = Math.floor(newWidth);
            size  = newWidth + difference
            size = size + "%";
            menuRef.current.style.width = size;
            //setMenuStyles({visibility: "visible", width: size, borderRightWidth: "0.2rem"});
            scheduled = null;
        }, 50)}
    console.log(menuRef.current.style.width)

    if(parseInt(menuRef.current.style.width, 10) < 30){
        menuRef.current.style.width = "0";
        menuRef.current.style.visibility = "hidden"
    }
    scheduled = event
}

import React, {useEffect, useRef} from "react";
import {useState} from "react";
import {Form, Col, Row, Card, Button, Alert} from "react-bootstrap"
import "./CreateRoomTab.css"
import {firestore} from "../../firebase";
import {useAuth} from "../../context/AuthContext";
import {useDashboard} from "../Dashboard";


function CreateRoomTab (){

    const {closeWindow} = useDashboard()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const {currentUser} = useAuth();
    const nameRef = useRef();
    const descRef = useRef();
    const passwordRef = useRef();
    const chatRoomsRef = firestore.collection('chatRooms');


    async function handleSubmit(e){
        e.preventDefault();
        setError("")
        setSuccess("")
        if ((await chatRoomsRef.doc(nameRef.current.value).get()).exists) return setError("Room with this name already exists. Please choose different name.")

        await chatRoomsRef.doc(nameRef.current.value).set({
            uid: currentUser.uid,
            Name: nameRef.current.value,
            Description: descRef.current.value,
            Password: passwordRef.current.value,
        }).then(room => setSuccess(`Successfully created chatroom "${ nameRef.current.value }"`),
            error => setError(error))
    }

    const [isPrivate, setPrivate] = useState(false);


    return (
        <Card className="create-room-container">
            <Card.Header>
                <button className="back-link" onClick={()=> closeWindow()} >
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-left"
                         className="svg-inline--fa fa-arrow-left fa-w-14" role="img"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor"
                              d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"/>
                    </svg>
                </button>
                <h2 className="text-center"> Host Chat Room</h2>
            </Card.Header>
            <Form className="create-room-menu" onSubmit={handleSubmit}>
                <Form.Group className="form-row">
                    <Form.Label>Name</Form.Label>
                    <Form.Control ref={nameRef} placeholder="Your chat room name" required/>
                </Form.Group>
                <Form.Group className="form-row">
                    <Form.Label>Description</Form.Label>
                    <Form.Control ref={descRef} placeholder="Brief description of your chatroom" required/>
                </Form.Group>
                <Form.Group className="form-checkbox">
                    <Form.Check label="Private Room" onChange={() => setPrivate(!isPrivate)} />
                </Form.Group>
                <Form.Group className="form-row">
                    <Form.Label style={{visibility: isPrivate ? "visible" : "hidden"}}>Password</Form.Label>
                    <Form.Control ref={passwordRef} style={{visibility: isPrivate ? "visible" : "hidden"}} disabled={!isPrivate} type="password" placeholder="Your chat room password"/>
                </Form.Group>
                <Form.Group className="create-room-footer">
                    <div className="alert-container">
                        {success && <Alert variant="success">{success}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                    </div>
                    <div className='button-tab'>
                        <Button type="submit" variant="outline-light" >Create Room</Button>
                        <Button variant="outline-danger" onClick={() => closeWindow()}>Cancel</Button>
                    </div>
                </Form.Group>
            </Form>
        </Card>
    )
}
a
export default CreateRoomTab;