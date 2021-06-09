import React, {useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {Alert, Form} from "react-bootstrap";
import "./HostRoom.css"
import {firestore} from "../../firebase";
import {useAuth} from "../../context/AuthContext";

export default function HostRoom(){
    const imageRef = useRef();
    const nameRef = useRef();
    const descRef = useRef();
    const {currentUser} = useAuth();
    const chatRoomsRef = firestore.collection('chatRooms');
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const history = useHistory();
    var timeout;



    async function handleSubmit(e){
        e.preventDefault();
        setError("")
        setSuccess("")
        if ((await chatRoomsRef.doc(nameRef.current.value).get()).exists) return setError("Room with this name already exists. Please choose different name.")
        await chatRoomsRef.doc(nameRef.current.value).set({
            uid: currentUser.uid,
            Host: currentUser.displayName,
            Name: nameRef.current.value,
            Description: descRef.current.value,
        }).then(room => setSuccess(`Successfully created chatroom "${ nameRef.current.value }"`),
            error => setError(error))
    }

    function animate(direction){
        clearTimeout(timeout)
        imageRef.current.style.animation = `swipe-${direction} 1.4s forwards`;
        timeout = setTimeout(() => imageRef.current.style.animation = "none", 1400)
    }

    return(
        <div className="edit-profile-container">
            <div className="nav-tab">
                <button onClick={()=> history.push("/")}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left"
                         className="svg-inline--fa fa-chevron-left fa-w-10" role="img"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path fill="currentColor"
                              d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/>
                    </svg>
                </button>
                <h2 style={{textAlign: "center"}}>Host Room</h2>
                <button type={"submit"} form={"host-room-form"} style={{marginRight: "auto"}}>
                    <svg  style={{width: "2rem"}} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check"
                         className="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 512 512">
                        <path fill="currentColor"
    d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/>
                    </svg>
                </button>
            </div>
            <div className={"main-column"}>
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
                    <button>
                        <svg onClick={()=> animate("left")} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left"
                             className="svg-inline--fa fa-chevron-left fa-w-10" role="img"
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor"
                                  d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/>
                        </svg>
                    </button>
                    <div className={"current-logo"}>
                        <svg ref={imageRef}  aria-hidden="true" focusable="false" data-prefix="fas" data-icon="dice-d20"
                             className="svg-inline--fa fa-dice-d20 fa-w-15" role="img"
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512">
                            <path fill="currentColor"
                                  d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07-108.64-190.1zM7.41 315.43L82.7 193.08 6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9l-76.64 45.99 75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1 208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75 340.43 208H240z"/>
                        </svg>
                    </div>
                    <button>
                        <svg onClick={()=> animate("right")} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right"
                             className="svg-inline--fa fa-chevron-right fa-w-10" role="img"
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path fill="currentColor"
    d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>


    )

}