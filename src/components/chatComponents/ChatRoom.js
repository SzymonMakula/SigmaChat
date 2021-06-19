import React, {useEffect, useRef, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import {database} from "../../firebase";
import "./ChatRoom.css"
import {useAuth} from "../../context/AuthContext";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";


export default function ChatRoom(){
    const databaseRef = database.ref();
    const history = useHistory();
    const dummy = useRef();
    const chatboxRef = useRef();
    let { roomId } = useParams();
    const {currentUser} = useAuth();
    const inputRef = useRef()
    const [loading, setLoading] = useState(true);
    const [profileToShow, setProfileToShow] = useState();
    const [roomInfo, setRoomInfo] = useState();
    const [messages, setMessages] = useState();



    async function getRoomInfo(){
        let roomData;
        await databaseRef.child('chatRooms').once('value', data => roomData = data.val());
        if (!roomId in Object.keys(roomData)) return;
        console.log("reading room info from db")
        return Promise.resolve(setRoomInfo(roomData[roomId]))
    }

    async function handleSubmit(e){
        let id = generateUniqueID()
        e.preventDefault();
        let message = {
            authorId: currentUser.uid,
            author: currentUser.displayName,
            authorPhoto: currentUser.photoURL,
            text: inputRef.current.value,
            timestamp: Date.now()
        }
        if(inputRef.current.value.length !== 0) await databaseRef.child(`messages/${roomId}/${id}`).set(message)
        inputRef.current.value = '';
        dummy.current.scrollIntoView({behavior: "smooth"})


    }

    async function getMessages(){
        await databaseRef.child(`messages/${roomId}`).on('value', snap => {
            let result = [];
            let msgs = snap.val();
            if (msgs != null){
            for (let id of Object.keys(msgs)){
                result.push(msgs[id])
            }
            console.log("reading from db")
            Promise.resolve(setMessages(result))}
        })
    }



    function ViewProfile(props) {
        const [isFriend, setFriend] = useState();
        const [loading, isLoading] = useState(true);

        async function AddFriend(id) {
            await databaseRef.child(`users/${currentUser.uid}/friends/${id}`).set({
                id: id
            }).then(fulfill => setFriend(true))
        }

         async function handleClick(id){
            if (!isFriend) await AddFriend(id)
            else console.log("other function")
        }


        useEffect(() => {
            databaseRef.child(`users/${currentUser.uid}/friends/${props.message.authorId}`).once(
                "value", snap => {setFriend(snap.val() != null); isLoading(false)})
        }, [])
        return (
            <>
                {!loading  &&
                <div className={"profile-box"} onMouseLeave={() => setProfileToShow(null)}>
                    <div className={"flex-row"}>
                        <img src={props.message.authorPhoto}/>
                        <span>{props.message.author}</span>
                    </div>
                    <Button onClick={event => {handleClick(props.message.authorId); event.preventDefault()}}
                            style={{display: props.message.authorId === currentUser.uid ? "none" : "inline-block"}}>
                        {isFriend ? "Send Message" : "Add Friend"}
                    </Button>
                </div>
                }
            </>
        )
    }

    function RepeatedMessage(props){
        return(
            <div className={"chatbox-message-window"} style={props.isOwnMessage ?{flexDirection: "row-reverse"}: {}} >
                <div className={"chatbox-profile"} style={{minWidth: "3.2rem"}} >
                </div>
                <div className={"chatbox-cloud"} style={{marginRight: "0.7rem", minWidth:    "3.9rem", width: "auto", flex: "min-content", marginTop: "0.05rem"}}>
                                    <span style={props.isOwnMessage ?{textAlign: "right", width: "auto"}: {background: "papayawhip"}}>
                                        {props.message.text}</span>
                </div>
            </div>
        )
    }


    function LastMessage(props){
        return(
            <div className={"chatbox-message-window"} style={props.isOwnMessage ? {flexDirection: "row-reverse"} : {}} >
                <div className={"chatbox-profile"}>
                    <img onClick={() => setProfileToShow(props.message)} src={props.message.authorPhoto} style={props.isOwnMessage ? {marginRight: "0.5rem"}: {}}/>
                </div>
                <div className={"chatbox-cloud"} style={{ marginRight: "0.3rem", minWidth:    "3.9rem", width: "auto", flex: "min-content",  marginTop: "0rem"}}>
                                    <span style={props.isOwnMessage ? {textAlign: "right", width: "auto"}: {background: "papayawhip"}}>
                                        {props.message.text}</span>
                </div>
            </div>
        )
    }
    function FirstMessage(props){
        return(
            <div className={"chatbox-message-window"} style={props.isOwnMessage ? {flexDirection: "row-reverse"} : {}} >
                <div className={"chatbox-profile"} style={{minWidth: "3.2rem"}}>
                </div>
                <div className={"chatbox-cloud"} style={{ marginRight: "0.3rem", minWidth:    "3.9rem", width: "auto", flex: "min-content",  marginTop: "0rem"}}>
                                    <span style={props.isOwnMessage ? {textAlign: "right", width: "auto"}: {background: "papayawhip"}}>
                                         <text style={props.isOwnMessage ?{marginLeft: "auto"} : {}}>{props.message.author}</text>
                                        {props.message.text}</span>
                </div>
            </div>
        )
    }



    useEffect(()=> {
        getRoomInfo();
        getMessages();
        console.log("render")
    }, [])

    console.log("rendering")
    return (
        <>
            <div className="column-container chatbox" >
                <div className="nav-tab">
                    <button onClick={()=> history.push("/")}>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left"
                             className="svg-inline--fa fa-chevron-left fa-w-10" role="img"
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor"
                                  d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/>
                        </svg>
                    </button>
                    {roomInfo &&
                    <h2 style={{textAlign: "left"}}>Chat Room: {roomInfo.Name}</h2>}
                </div>
                <div key={generateUniqueID()} className="chatbox-main" ref={chatboxRef} onLoad={() => dummy.current.scrollIntoView()}>
                    {messages && messages.map((message, index) => {
                        // Maps over array of messages in JSON format. Format messages differently for first, last,
                        // repeated and regular (one time) messages.

                        let isOwnMessage = message.authorId === currentUser.uid;
                        if (index + 1 < messages.length && messages[index +1].authorId === message.authorId){
                            if (messages[index-1] && messages[index -1].authorId !== message.authorId)
                                return <FirstMessage key={generateUniqueID()} isOwnMessage={isOwnMessage} message={message}/>
                            return <RepeatedMessage key={generateUniqueID()} isOwnMessage={isOwnMessage} message={message}/>
                        }
                        if (messages[index - 1].authorId === message.authorId){
                            return <LastMessage key={generateUniqueID()} isOwnMessage={isOwnMessage} message={message}/>
                        }
                        return (
                            <div className={"chatbox-message-window"} style={isOwnMessage ? {flexDirection: "row-reverse"} : {}}
                                 key={generateUniqueID()}>
                                <div className={"chatbox-profile"}>
                                    <img onClick={() => setProfileToShow(message)} src={message.authorPhoto} style={isOwnMessage ? {marginRight: "0.5rem"}: {}}/>
                                </div>
                                <div className={"chatbox-cloud"} style={isOwnMessage ?{
                                    marginRight: "0.3rem",
                                    minWidth: "4rem",
                                    width: "auto",
                                    flex: "min-content"
                                }: {}}>
                                <span style={isOwnMessage ?{textAlign: "right", width: "auto"} : {background: "papayawhip"}}>
                                    <text style={isOwnMessage ?{marginLeft: "auto"} : {}}>{message.author}</text>
                                    {message.text}</span>
                                </div>
                            </div>
                        )
                    }
                )}
                <div ref={dummy}/>
            </div>
            <div className={"chatbox-input-row"}>
                <form onSubmit={event => handleSubmit(event)}>
                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="laugh-beam"
                         className="svg-inline--fa fa-laugh-beam fa-w-16" role="img"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                        <path fill="currentColor"
d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm141.4 389.4c-37.8 37.8-88 58.6-141.4 58.6s-103.6-20.8-141.4-58.6S48 309.4 48 256s20.8-103.6 58.6-141.4S194.6 56 248 56s103.6 20.8 141.4 58.6S448 202.6 448 256s-20.8 103.6-58.6 141.4zM328 152c-23.8 0-52.7 29.3-56 71.4-.7 8.6 10.8 11.9 14.9 4.5l9.5-17c7.7-13.7 19.2-21.6 31.5-21.6s23.8 7.9 31.5 21.6l9.5 17c4.1 7.4 15.6 4 14.9-4.5-3.1-42.1-32-71.4-55.8-71.4zm-201 75.9l9.5-17c7.7-13.7 19.2-21.6 31.5-21.6s23.8 7.9 31.5 21.6l9.5 17c4.1 7.4 15.6 4 14.9-4.5-3.3-42.1-32.2-71.4-56-71.4s-52.7 29.3-56 71.4c-.6 8.5 10.9 11.9 15.1 4.5zM362.4 288H133.6c-8.2 0-14.5 7-13.5 15 7.5 59.2 58.9 105 121.1 105h13.6c62.2 0 113.6-45.8 121.1-105 1-8-5.3-15-13.5-15z"/>
                    </svg>
                    <input  placeholder={"Your message..."} onSubmit={e => handleSubmit(e)} minLength={"1"} maxLength={"256"} ref={inputRef}/>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="camera-retro"
                         className="svg-inline--fa fa-camera-retro fa-w-16" role="img"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
d="M48 32C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zm0 32h106c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H38c-3.3 0-6-2.7-6-6V80c0-8.8 7.2-16 16-16zm426 96H38c-3.3 0-6-2.7-6-6v-36c0-3.3 2.7-6 6-6h138l30.2-45.3c1.1-1.7 3-2.7 5-2.7H464c8.8 0 16 7.2 16 16v74c0 3.3-2.7 6-6 6zM256 424c-66.2 0-120-53.8-120-120s53.8-120 120-120 120 53.8 120 120-53.8 120-120 120zm0-208c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88zm-48 104c-8.8 0-16-7.2-16-16 0-35.3 28.7-64 64-64 8.8 0 16 7.2 16 16s-7.2 16-16 16c-17.6 0-32 14.4-32 32 0 8.8-7.2 16-16 16z"/>
                    </svg>
                </form>
            </div>
        </div>
            {profileToShow && <ViewProfile message={profileToShow} />}
        </>
    )

}