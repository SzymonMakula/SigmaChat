import React, {useEffect, useRef, useState} from "react";
import {useHistory, useParams, useRouteMatch} from "react-router-dom";
import {database} from "../firebase";
import {useAuth} from "../context/AuthContext";
import "./PrivateChatRoom.css"
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import FirstMessage from "../components/chatComponents/Messages/FirstMessage";
import RepeatedMessage from "../components/chatComponents/Messages/RepeatedMessage";
import LastMessage from "../components/chatComponents/Messages/LastMessage";
import SingleMessage from "../components/chatComponents/Messages/SingleMessage";
import ViewProfile from "../components/chatComponents/ViewProfile";

export default function PrivateChatRoom(){
    let { roomId } = useParams();
    const databaseRef = database.ref();
    const {path, url} = useRouteMatch();
    const [profileToShow, setProfileToShow] = useState(null);
    const [scrollPosition, setScrollPosition]= useState(0);
    const history = useHistory();
    const {currentUser} = useAuth();
    const [chatPartner, setChatPartner] = useState();
    const [messages, setMessages] = useState();
    const inputRef = useRef();
    const dummy = useRef();
    const chatboxRef = useRef();
    var scheduled;


    async function loadMessages(){
        await databaseRef.child(`privateMessages/${roomId}`).on('value', snap => {
            let result = [];
            let msgs = snap.val();
            if (msgs != null){
                for (let id of Object.keys(msgs)){
                    result.push(msgs[id])
                }
                console.log("reading from db")
                setMessages(result);
            }
        })
    }
    async function handleSubmit(e){
        let id = generateUniqueID()
        e.preventDefault();
        let message = {
            authorId: currentUser.uid,
            text: inputRef.current.value,
            timestamp: Date.now()
        }
        if(inputRef.current.value.length !== 0) await databaseRef.child(`privateMessages/${roomId}/${id}`).set(message)
        inputRef.current.value = '';
        //dummy.current.scrollIntoView({behavior: "smooth"})
    }

    function updateScrollPosition(event){
        if(!scheduled) {
            setTimeout(() => {
                try{
                    setScrollPosition(chatboxRef.current.scrollHeight - chatboxRef.current.scrollTop - chatboxRef.current.offsetHeight)
                }
                catch (err){
                }
                scheduled = null;
            }, 1500)
        }
        scheduled = event
    }

    async function loadMembers(){
        let members = [];
        await databaseRef.child(`privateRooms/${roomId}/members/`).once("value", snap => {
            members = snap.val();
        })
        if (!members.includes(currentUser.uid)) return history.push("/")

        let chatPartnerId = members.filter(memberId => memberId !== currentUser.uid)
        let chatPartnerData;
        await databaseRef.child(`users/${chatPartnerId}`).once("value", snap => {
            chatPartnerData = snap.val();
        })
        setChatPartner(chatPartnerData)
    }

    useEffect(() => {
        loadMembers()
        loadMessages()
    }, [])


    return(
        <>
            {chatPartner &&
            <>
                <div className="column-container chatbox">
                    <div className="nav-tab">
                        <button onClick={() => history.push("/")}>
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left"
                                 className="svg-inline--fa fa-chevron-left fa-w-10" role="img"
                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path fill="currentColor"
                                      d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/>
                            </svg>
                        </button>
                        <h2 style={{textAlign: "left", fontSize: "1.7rem"}}>{chatPartner.displayName}</h2>
                    </div>
                    <div className="chatbox-main" ref={chatboxRef} onScroll={() => updateScrollPosition()}>
                        {messages && messages.map((message, index) => {
                                // Maps over array of messages in JSON format. Format messages differently for first, last,
                                // repeated and regular (one time) messages.
                                let isOwnMessage = message.authorId === currentUser.uid;
                                let profile;
                                isOwnMessage ? profile = currentUser : profile = chatPartner


                                if (index + 1 < messages.length && messages[index + 1].authorId === message.authorId ) {
                                    if ((messages[index - 1] && messages[index - 1].authorId !== message.authorId) || !messages[index-1])
                                        return <FirstMessage key={generateUniqueID()} isOwnMessage={isOwnMessage}
                                                             message={message} profile={profile}/>
                                    return <RepeatedMessage key={generateUniqueID()} isOwnMessage={isOwnMessage}
                                                            message={message} profile={profile}/>
                                }
                                if (messages[index - 1] && messages[index - 1].authorId === message.authorId) {
                                    return <LastMessage key={generateUniqueID()} isPrivateRoom={true} setProfileToShow={setProfileToShow}
                                                        isOwnMessage={isOwnMessage} message={message} profile={profile}/>
                                }
                                return <SingleMessage key={generateUniqueID()} setProfileToShow={setProfileToShow}
                                                      isOwnMessage={isOwnMessage} message={message} profile={profile}/>
                            }
                        )}
                        <div ref={dummy} />
                    </div>
                    {profileToShow && <ViewProfile chatboxRef={chatboxRef} message={profileToShow} profile={profileToShow} setProfileToShow={setProfileToShow}/>}
                    <div className={"chatbox-input-row"}>
                        <form onSubmit={event => handleSubmit(event)}>
                            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="laugh-beam"
                                 className="svg-inline--fa fa-laugh-beam fa-w-16" role="img"
                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                                <path fill="currentColor"
                                      d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm141.4 389.4c-37.8 37.8-88 58.6-141.4 58.6s-103.6-20.8-141.4-58.6S48 309.4 48 256s20.8-103.6 58.6-141.4S194.6 56 248 56s103.6 20.8 141.4 58.6S448 202.6 448 256s-20.8 103.6-58.6 141.4zM328 152c-23.8 0-52.7 29.3-56 71.4-.7 8.6 10.8 11.9 14.9 4.5l9.5-17c7.7-13.7 19.2-21.6 31.5-21.6s23.8 7.9 31.5 21.6l9.5 17c4.1 7.4 15.6 4 14.9-4.5-3.1-42.1-32-71.4-55.8-71.4zm-201 75.9l9.5-17c7.7-13.7 19.2-21.6 31.5-21.6s23.8 7.9 31.5 21.6l9.5 17c4.1 7.4 15.6 4 14.9-4.5-3.3-42.1-32.2-71.4-56-71.4s-52.7 29.3-56 71.4c-.6 8.5 10.9 11.9 15.1 4.5zM362.4 288H133.6c-8.2 0-14.5 7-13.5 15 7.5 59.2 58.9 105 121.1 105h13.6c62.2 0 113.6-45.8 121.1-105 1-8-5.3-15-13.5-15z"/>
                            </svg>
                            <input ref={inputRef} onSubmit={event => handleSubmit(event)} placeholder={"Your message..."}  minLength={"1"}
                                   maxLength={"256"}/>
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="camera-retro"
                                 className="svg-inline--fa fa-camera-retro fa-w-16" role="img"
                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor"
                                      d="M48 32C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zm0 32h106c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H38c-3.3 0-6-2.7-6-6V80c0-8.8 7.2-16 16-16zm426 96H38c-3.3 0-6-2.7-6-6v-36c0-3.3 2.7-6 6-6h138l30.2-45.3c1.1-1.7 3-2.7 5-2.7H464c8.8 0 16 7.2 16 16v74c0 3.3-2.7 6-6 6zM256 424c-66.2 0-120-53.8-120-120s53.8-120 120-120 120 53.8 120 120-53.8 120-120 120zm0-208c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88zm-48 104c-8.8 0-16-7.2-16-16 0-35.3 28.7-64 64-64 8.8 0 16 7.2 16 16s-7.2 16-16 16c-17.6 0-32 14.4-32 32 0 8.8-7.2 16-16 16z"/>
                            </svg>
                        </form>
                    </div>
                </div>
                <button onClick={() => dummy.current.scrollIntoView({behavior: "smooth"})} className={"scroll-to-newest-button"} style={{opacity: scrollPosition > 500 ? "100" : "0"}}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-circle-down"
                    className="svg-inline--fa fa-chevron-circle-down fa-w-16" role="img"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor"
                    d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM273 369.9l135.5-135.5c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L256 285.1 154.4 183.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L239 369.9c9.4 9.4 24.6 9.4 34 0z"/>
                    </svg>
                </button>
            </>
            }
        </>
    )

}