import React, {useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {Alert, Button} from "react-bootstrap";
import {useAuth} from "../../context/AuthContext";


export default function ChangeProfilePassword(){
    const history = useHistory();
    const oldPassRef = useRef();
    const newPassRef = useRef();
    const confirmPass = useRef();
    const {changePassword, reauthenticate} = useAuth();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [buttonState, setButtonState] = useState('secondary')

    async function handleSubmit(e) {
        e.preventDefault();
        if (newPassRef.current.value !== confirmPass.current.value) {
            return setError("Passwords do not match")
        }
        try{
            await reauthenticate(oldPassRef.current.value)
            await changePassword(newPassRef.current.value)
        }
        catch (error){
            setSuccess('')
            return setError(error.message);
        }

        setError('')
        setButtonState('secondary')
        setSuccess("Successfully changed password")
        let credentials = [oldPassRef,  newPassRef, confirmPass]
        for (let credential of credentials) credential.current.value = null;
    }

    function handleButtonState(){
        if (newPassRef.current.value.length > 0 && confirmPass.current.value.length > 0
            && oldPassRef.current.value.length> 0) return setButtonState('success')
        setButtonState('secondary')
    }



    return(
        <div className="column-container profile-edit change-credential-container">
            <div className="nav-tab">
                <button onClick={()=> history.push(`/edit-profile`)}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left"
                         className="svg-inline--fa fa-chevron-left fa-w-10" role="img"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path fill="currentColor"
                              d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/>
                    </svg>
                </button>
                <h2>Change password</h2>
            </div>
                <div className="w-100 h-100" style={{marginTop: "auto"}}>
                    <form className="reset-password-form" onSubmit={e => handleSubmit(e)}
                          onChange={() => handleButtonState()}>
                        <span> CURRENT PASSWORD</span>
                        <input ref={oldPassRef} className={"editable-input"} type="password"
                               placeholder={" 🔒 "} required/>
                        <span> NEW PASSWORD</span>

                        <input ref={newPassRef} className={"editable-input"} type="password"
                               placeholder={" 🔒 "} required/>
                        <span> CONFIRM NEW PASSWORD</span>

                        <input ref={confirmPass} className={"editable-input"} type="password"
                               placeholder={" 🔒 "} required/>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        <Button className={`btn btn-${buttonState}`} type="submit">CHANGE PASSWORD</Button>
                    </form>
                </div>
        </div>
    )
}