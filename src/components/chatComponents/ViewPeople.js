import React from "react";
import "../../styles/ViewPeople.css"
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {useAuth} from "../../context/AuthContext";

export default function ViewPeople(props){
    const {currentUser} = useAuth()
    const users = props.users ?  props.users.filter(user => user.uid !== currentUser.uid) : null

    return(
        <>
        <div className={"column-container chatters-list"}>
            <div className={"nav-tab"}>
                <h2 style={{textAlign: "left", marginLeft: "1rem"}}>People Chatting</h2>
            </div>
            <div className={"column-container"}>
                {users && users.map(user => (
                    <div key={generateUniqueID()} className={"chatter-cloud"} onClick={() => props.setProfileToShow(user)}>
                        <img src={user.photoURL}/>
                        <span>{user.displayName}</span>
                    </div>
                )
                )}
            </div>
        </div>
            </>
    )

}
