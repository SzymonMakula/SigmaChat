import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {database} from "../../firebase";
import {useAuth} from "../../context/AuthContext";
import "../../styles/FriendsList.css"
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";


export default function FriendsList(){
    const databaseRef = database.ref();
    const history = useHistory();
    const {currentUser} = useAuth();
    const [friends, setFriends] = useState();




    async function removeFriend(id){
        await databaseRef.child(`users/${currentUser.uid}/friends/${id}`).remove()
        await loadFriends();
    }


    async function loadFriends(){
        let friendsIds = [];
        let friendsData = [];
        await databaseRef.child(`users/${currentUser.uid}/friends`).once("value", snap =>{
             let data = snap.val();
             if (data) {
                 friendsIds.push(Object.keys(data))
                 friendsIds = friendsIds.flat()
             }
        })
        await databaseRef.child(`users/`).once("value", snap => {
            let data = snap.val();
            for (let friendId of friendsIds){
                friendsData.push(data[friendId])
            }
        })
        setFriends(friendsData)
    }

    useEffect(() => {
        Promise.resolve(loadFriends());

    }, [])


    return(
        <>
            {friends &&
                <div className={"column-container"} style={{height: "100%", background: "lightsteelblue"}}>
                    <div className="nav-tab">
                        <button onClick={() => history.push("/")}>
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left"
                                 className="svg-inline--fa fa-chevron-left fa-w-10" role="img"
                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path fill="currentColor"
                                      d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/>
                            </svg>
                        </button>
                        <h2 style={{textAlign: "left"}}>My Friend List</h2>
                    </div>
                    <div className={"main-column"} style={{overflowY: "auto"}}>
                        {friends.length === 0 && <span id={"no-friends-message"}>No friends to show. Go on, chat and get some friends!</span>}
                        {friends.map(friend => {
                            return (
                                <div className={"friend-box"} key={generateUniqueID()}>
                                    <div className={"friend-picture"}>
                                        <img src={friend.photoURL}/>
                                    </div>
                                    <span>{friend.displayName}</span>
                                    <div className={"flex-row justify-content-end w-100"} style={{display: "flex"}}>
                                        <button onClick={() => removeFriend(friend.uid)}>
                                            <svg aria-hidden="true" focusable="false" data-prefix="fas"
                                                 data-icon="user-alt-slash"
                                                 className="svg-inline--fa fa-user-alt-slash fa-w-20" role="img"
                                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                <path fill="currentColor"
                                                      d="M633.8 458.1L389.6 269.3C433.8 244.7 464 198.1 464 144 464 64.5 399.5 0 320 0c-67.1 0-123 46.1-139 108.2L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4l588.4 454.7c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.4-6.8 4.1-16.9-2.9-22.3zM198.4 320C124.2 320 64 380.2 64 454.4v9.6c0 26.5 21.5 48 48 48h382.2L245.8 320h-47.4z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )
                            }
                        )}
                    </div>
                </div>}
            </>
    )

}