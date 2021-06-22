import React, {useEffect, useRef, useState} from "react";
import {Button} from "react-bootstrap";
import {database} from "../../firebase";
import {useAuth} from "../../context/AuthContext";

export default function ViewProfile(props) {
    const databaseRef = database.ref();
    const [isFriend, setFriend] = useState();
    const {currentUser} = useAuth();

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
            {!loading &&
            <div className={"profile-box"} onMouseLeave={() => props.setProfileToShow(null)}>
                <div className={"flex-row"}>
                    <img src={props.message.authorPhoto}/>
                    <span>{props.message.author}</span>
                </div>
                <Button onClick={event => {handleClick(props.message.authorId); event.preventDefault()}}
                        style={{display: props.message.authorId === currentUser.uid ? "none" : "inline-block"}}>
                    {isFriend ? "Send Message" : "Add Friend"}
                </Button>
            </div>}

        </>
    )
}