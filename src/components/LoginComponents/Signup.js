import React, {useRef, useState} from "react";
import {Form, Button, Card, Alert} from "react-bootstrap"
import {useAuth} from "../../context/AuthContext";
import {Link, Redirect, useHistory} from "react-router-dom"
import {database, storage} from "../../firebase";



export default function Signup(){
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const databaseRef = database.ref();
    const {signup, currentUser} = useAuth();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const imageRef = useRef();
    var timeout;


    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        if (passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError('Passwords do not match')
        }
        await signup(emailRef.current.value, passwordRef.current.value).then(accept => {
            setLoading(false);
            history.push("/");
        }, reject => {
            setLoading(false)
            setError(reject.message)
        })
    }

    if (currentUser) return <Redirect to="/"/>
    function animate(){
        clearTimeout(timeout);
        imageRef.current.style.animation = "shake 0.8s forwards";
        timeout = setTimeout(() => imageRef.current.style.animation = "none", 800)
    }

    return(
        <div className="login-container">
            <Card className="login-card" >
                <div className="login-image">
                    <svg onClick={() => animate()} ref={imageRef} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="dice-d20"
                         className="svg-inline--fa fa-dice-d20 fa-w-15" role="img"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512">
                        <path fill="currentColor"
                              d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07-108.64-190.1zM7.41 315.43L82.7 193.08 6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9l-76.64 45.99 75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1 208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75 340.43 208H240z"/>
                    </svg>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form className="login-body" onSubmit={handleSubmit}>
                    <h2 className="register-header">Register Account</h2>
                    <Form.Group id="email">
                        <Form.Control type="email" ref={emailRef} placeholder={" ✉️  ️  Email"} maxLength={"40"} required/>
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Control type="password" ref={passwordRef} placeholder={" 🔒   Password"} maxLength={"30"} required/>
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Control type="password" ref={passwordConfirmRef} placeholder={" 🔒   Confirm Password"} maxLength={"30"} required/>
                    </Form.Group>

                    <Button disabled={loading} type="submit" >REGISTER ACCOUNT</Button>
                    <div className="register-link">
                        <Link to="/login">Already have an Account? Log In 🠖</Link>
                    </div>
                </Form>

            </Card>

        </div>
    )
}




