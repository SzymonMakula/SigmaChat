import React, {useEffect, useRef, useState} from "react";
import {Form, Alert} from "react-bootstrap";
import {useHistory} from "react-router-dom"
import "./editProfile.css"
import {useAuth} from "../../context/AuthContext";
import {database, storage} from "../../firebase";

export default function EditProfile(){
    const nameRef = useRef();
    const bioRef = useRef()
    const {currentUser, logout} = useAuth();
    const buttonRef = useRef();
    const databaseRef = database.ref();
    const storageRef = storage.ref();
    const [uploadFile, setUploadFile] = useState('')
    const [isDisabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const history = useHistory();
    const [profile, setProfile] = useState();

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

        if (uploadFile){
            let imageRef = storageRef.child(`images/${currentUser.uid}`);
            let uploadTask = await imageRef.put(uploadFile, null);
            imageUrl = await uploadTask.ref.getDownloadURL().then(url => url)
        }
        if(currentUser.displayName === nameRef.current.value && !imageUrl && bioRef.current.value === profile.bio) {
            setLoading(false);
            setButtonState(inactiveButtonStyle)
            return setError('New nickname must be different than the previous one.');
        }

        await currentUser.updateProfile({
            displayName: nameRef.current.value,
            photoURL: imageUrl ? imageUrl : currentUser.photoURL
        }).then(success => {setSuccess("Profile updated successfully.");
            setButtonState(inactiveButtonStyle);
            setDisabled(true);
        }, error => setError("Error occurred"))
        setLoading(false);
        await databaseRef.child(`users/${currentUser.uid}`).update({
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            bio: bioRef.current.value
        })
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
    useEffect(() => {
        databaseRef.child(`users/${currentUser.uid}`).once("value", snap => {
            setProfile(snap.val())
            setLoading(false)

        })
    }, [])


    return(
        <>
        {profile &&
            <div className="column-container">
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
                    <button onClick={() => logout()} style={{marginLeft: "auto"}}>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sign-out-alt"
                             className="svg-inline--fa fa-sign-out-alt fa-w-16" role="img"
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor"
    d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"/>
                        </svg>
                    </button>
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
                                    <input className="editable-input" type="text" onChange={event => handleButtonHighlight(event)} ref={nameRef} defaultValue={userName} minLength={"4"} maxLength={"16"} required/>
                                </Form.Group>
                        </div>
                    </div>
                    <span style={{textAlign: "left", fontSize: "1.4rem", marginTop: "0.7rem", marginLeft: "1rem", minHeight: "2rem"}}>My bio:</span>
                    <input defaultValue={profile.bio} onChange={event => handleButtonHighlight(event)} minLength={"4"} ref={bioRef} className={"editable-input"} type={"text"} style={{marginTop: "1.2rem", marginLeft: "1rem", alignSelf: "center"}}
                           placeholder={"Share a little bit about yourself"}/>
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
            </div>}
        </>
    )
}