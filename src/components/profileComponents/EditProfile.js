import React, {useContext, useEffect, useRef, useState} from "react";
import {Form, Button, Alert, Card} from "react-bootstrap";
import {Link, Redirect, useHistory, useRouteMatch} from "react-router-dom"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import "./editProfile.css"
import ChangeProfileEmail from "./ChangeProfileEmail";
import PrivateRoute from "../LoginComponents/PrivateRoute";
import ChangeProfilePassword from "./ChangeProfilePassword";
import {useAuth} from "../../context/AuthContext";
import {storage} from "../../firebase";

export default function EditProfile(){
    const nameRef = useRef();
    const {currentUser} = useAuth();
    const buttonRef = useRef();
    const storageRef = storage.ref();
    const [uploadFile, setUploadFile] = useState('')
    const [isDisabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const history = useHistory();

    const userInfo = {
        name : currentUser.displayName,
        email : currentUser.email,
        photoUrl : currentUser.photoURL,
        emailVerified : currentUser.emailVerified,
        uid :currentUser.uid
    }
    const [userImage, setUserImage] = useState(userInfo.photoUrl);
    const userName = userInfo.name ? userInfo.name : userInfo.email.match(/(.+)+?@/)[1];

    const activeButtonStyle = {
        transition: "600ms ease",
        disabled: false,
        color: "white",
        backgroundColor: "limegreen"
    }
    const inactiveButtonStyle = {
        disabled: true,
        color: "white",
        backgroundColor: "lightslategrey"
    }
    const [buttonStateStyle, setButtonState] = useState(inactiveButtonStyle);

    async function handleSubmit(e){
        e.preventDefault();
        let imageUrl;
        setLoading(true);
        setError('');
        setSuccess('');
        if(currentUser.displayName === nameRef.current.value) return setError('New nickname must be different than the previous one.');
        if (uploadFile){
            let imageRef = storageRef.child(`images/${currentUser.uid}`);
            let uploadTask = await imageRef.put(uploadFile, null);
            imageUrl = await uploadTask.ref.getDownloadURL().then(url => url)
        }
        await currentUser.updateProfile({
            displayName: nameRef.current.value,
            photoURL: imageUrl ? imageUrl : currentUser.photoURL
        }).then(success => {setSuccess("Profile updated successfully.");
            setButtonState(inactiveButtonStyle);
            setDisabled(true);
            setUserImage(currentUser.photoURL)
        }, error => setError("Error occurred"))
        setLoading(false);
    }


    function loadPicture(event){
        if(event.target.files.length !== 0) {
            setUploadFile(event.target.files[0]);
            setUserImage(URL.createObjectURL(event.target.files[0]))
            setButtonState(activeButtonStyle)
            setDisabled(false)
        }
    }

    function handleButtonHighlight(event){
        //add handler for User name change. Maybe change the color to red while editing process is in motion?
        // if changing name handler throws an exception, just highlight the form border with red colour
        setButtonState(activeButtonStyle);
        setDisabled(false)
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
                    <h2>Edit Profile</h2>
                </div>
                <Form onSubmit={event => handleSubmit(event)}>
                    <div className="edit-profile-main">
                        <div className="edit-picture-frame">
                            <label className={"custom-picture-upload"} style={{backgroundImage: `url(${userImage})`}}>
                                <text>Change picture</text>
                                <input accept="image/*" name="image" type={"file"} onChange={event => loadPicture(event)}/>
                            </label>
                        </div>
                        <div className="edit-name-frame">
                                <Form.Group id="text">
                                    <input className="editable-input" type="text" onChange={event => handleButtonHighlight(event)} ref={nameRef} defaultValue={userName} required/>
                                </Form.Group>
                        </div>
                    </div>
                <button type={"submit"} disabled={isDisabled} ref={buttonRef} style={buttonStateStyle}>
                    <span>{loading ? "Updating Profile..." : "Update Profile"} </span>
                    <span style={{display: loading ? "inline-block" : "none"}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                </button>
                </Form>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <div className="big-buttons-container">
                <button className="change-credential-button" onClick={()=> history.push("/edit-profile/email")}>
                    CHANGE EMAIL ADDRESS
                </button>
                <button className="change-credential-button" onClick={()=> history.push("/edit-profile/password")}>
                    CHANGE PASSWORD
                </button>
                </div>
            </div>
    )
}