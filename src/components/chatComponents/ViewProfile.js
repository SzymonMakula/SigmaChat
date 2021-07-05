import React, {useEffect, useRef, useState} from "react";
import {Button} from "react-bootstrap";
import {database} from "../../firebase";
import {useAuth} from "../../context/AuthContext";
import "./ViewProfile.css"

export default function ViewProfile(props) {
    const databaseRef = database.ref();
    const [isFriend, setFriend] = useState();
    const {currentUser} = useAuth();
    const [background, setBackground] = useState(  "linear-gradient(#005dab, white" )

    const [loading, setLoading] = useState(true);

    async function AddFriend(id) {
        let friend = {};
        friend[id] = true;
        await databaseRef.child(`users/${currentUser.uid}/friends`).update(friend).then
        (accept => setFriend(true)).catch(err => setFriend(false))
    }

    async function handleClick(id){
        if (!isFriend) await AddFriend(id)
        else console.log("other function")
    }
    async function checkForFriend(){
        let friend;
        await databaseRef.child(`users/${currentUser.uid}/friends/${props.profile.uid}`).once(
            "value", snap => {
                friend = snap.val() != null
            })
        setFriend(friend)
    }


    useEffect(() => {
        Promise.resolve(checkForFriend())
    }, [props.profile.uid])

    useEffect(() => {
        isFriend || currentUser.uid === props.profile.uid ? setBackground("linear-gradient(#48ff00, #0066e0)") : setBackground("linear-gradient(#005dab, white" );
        if(isFriend !== undefined) setLoading(false)
    }, [isFriend])


    return (
        <>
            {!loading &&
            <div className={"view-profile-container"} style={{background: background}}>
                <div className={"view-profile-box"}>
                    <div className={"view-profile-picture"}>
                        <img src={props.profile.photoURL}/>
                    </div>
                    <div className={"view-profile-info"}>
                        <span>Hello, my name is: </span>
                        <span style={{color: "steelblue", borderBottom: "0.2rem black solid"}}>{props.profile.displayName}</span>
                        <span style={{fontSize: "1rem"}}>About me:</span>
                        <span style={{fontSize: "0.7rem"}}>{props.profile.bio}</span>
                    </div>
                </div>
                {isFriend && props.profile.uid !== currentUser.uid && <span style={{color: "white", textAlign: "center", fontSize: "1.4rem"}}>We're friends already!</span>}
                <Button className={"btn btn-outline-success"} onClick={event => {handleClick(props.profile.uid); event.preventDefault()}}
                        style={{display: props.profile.uid === currentUser.uid || isFriend ? "none" : "inline-block"}}>
                    {"Add Friend"}
                </Button>
            </div>}

        </>
    )
}