import React, {useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {Alert, Form} from "react-bootstrap";
import "./HostRoom.css"
import {useAuth} from "../../context/AuthContext";
import {storage, database} from "../../firebase";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {useApp} from "../App";

export default function HostRoom(){
    const imageRef = useRef();
    const nameRef = useRef();
    const descRef = useRef();
    const storageRef = storage.ref();
    const databaseRef = database.ref()
    const {currentUser} = useAuth();
    const [logos, setlogos] = useState();
    const [index, setIndex] = useState(2)
    const [currentAnimation, setAnimation] = useState('none')
    const [loading, setLoading] = useState(false)
    const [playingAnimation, setPlaying] = useState(false)
    const [error, setError] = useState('')
    const history = useHistory();
    var timeouts = [];


    async function createRoom(id){
        let roomExists;
        await databaseRef.child('chatRooms').once("value", snap => {
            let roomsArray = [];
            let rooms = snap.val();
            if (rooms !== null) {
                for (let id of Object.keys(rooms)) {
                    roomsArray.push(rooms[id])
                }
            }
            let roomNames = roomsArray.map(room => room.Name)
            if (roomNames.includes(nameRef.current.value)) return roomExists = true;
        })
        if (roomExists) {
            setLoading(false);
            return setError("Room with this name already exists. Please choose different name.");
        }


        databaseRef.child(`chatRooms/${id}`).set({
            roomId: id,
            Description: descRef.current.value,
            HostId: currentUser.uid,
            Logo: index,
            Name: nameRef.current.value
        }).then(resolve => {
            setError("")
            setLoading(false);
            let room = {};
            room[nameRef.current.value] = true
            databaseRef.child('chatRoomNames/').update(room).then(resolve => {
                history.push(`/chatrooms/${id}`)}, error => setError(error.message))
        }, error => setError(error.message))
    }

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true)
        let id = generateUniqueID();
        await createRoom(id)
    }

    async function loadLogos(){
        let urls = await storageRef.child("logos/").list().then(item => item.items.map(sth => sth.getDownloadURL()));
        return Promise.all(urls)
    }

    useEffect(() => {
        loadLogos().then(collection => {
            let logos = [];
            collection.map(logo =>{
                logos.push(logo);
            });
            setlogos(logos)
            }
        )
    }, [])

    function incrementIndex(){
        setPlaying(true)
        timeouts.push(setTimeout(()=> setPlaying(false), 900))
        timeouts.push(setTimeout(() => setIndex(index < logos.length - 1 ? index + 1: 0), 450))
    }
    function decrementIndex() {
        setPlaying(true)
        timeouts.push(setTimeout(()=> setPlaying(false), 900))
        timeouts.push(setTimeout( () => setIndex(index > 0 ? index - 1 : logos.length - 1), 450))
    }
    

    function animate(direction){
        setAnimation(`swipe-${direction} 0.9s forwards`);
        timeouts.push(setTimeout(() => setAnimation("none"), 900))}


    useEffect(() => {
        return () => {for (let timeout of timeouts) clearTimeout(timeout)}
    }, [])




    return(
        <div className="column-container host-room">
            <div className="nav-tab">
                <button onClick={()=> history.push("/")}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left"
                         className="svg-inline--fa fa-chevron-left fa-w-10" role="img"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path fill="currentColor"
                              d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/>
                    </svg>
                </button>
                <h2>Host Room</h2>
                <button type={"submit"} form={"host-room-form"}>
                    <svg  style={{width: "2rem"}} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                         className="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 512 512">
                        <path fill="currentColor"
    d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
                    </svg>
                </button>
            </div>
            {!logos &&
            <div className={"loading-container"} style={{color: "black"}}>
                <div className="spinner-border text-dark" role="status"/>
                <span>Loading...</span>
            </div>
            }
            {logos && <div className={"main-column"}>
                <Form onSubmit={(event)=> handleSubmit(event)} id="host-room-form">
                    <Form.Group id="text" className={"room-info-row"}>
                        <input ref={nameRef} className="editable-input" type="text" placeholder={"Your chat room name"} required/>
                    </Form.Group>
                    <Form.Group id="text" className={"room-info-row"}>
                        <input ref={descRef} className="editable-input" type="text" placeholder={"Brief description of your chat room"} required/>
                    </Form.Group>
                </Form>
                {error && <Alert variant="danger">{error}</Alert>}
                <span>Chat room logo</span>
                <div className={"logo-picker"}>
                    <button disabled={playingAnimation} onClick={()=> {animate("left"); decrementIndex()}}>
                        <svg  aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left"
                             className="svg-inline--fa fa-chevron-left fa-w-10" role="img"
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor"
                                  d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/>
                        </svg>
                    </button>
                    <div className={"current-logo"}>
                         <img style={{animation: loading ?  "shake 0.8s forwards infinite" :currentAnimation}} ref={imageRef} src={logos[index]} alt={"Current Logo"}/>
                    </div>
                    <button disabled={playingAnimation} onClick={()=> {animate("right"); incrementIndex()}}>
                        <svg  aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right"
                             className="svg-inline--fa fa-chevron-right fa-w-10" role="img"
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor"
    d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
                        </svg>
                    </button>
                </div>
            </div>}
        </div>


    )

}