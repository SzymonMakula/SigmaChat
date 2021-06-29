import React from "react";

export default function LastMessage(props){

    return(
        <div className={"chatbox-message-window"} style={props.isOwnMessage ? {flexDirection: "row-reverse", alignItems: "flex-start", marginBottom: "0.8rem"} : {alignItems: "flex-start", marginBottom: "0.8rem"}} >
            <div className={"chatbox-profile"}>
                <img onClick={() => props.setProfileToShow(props.profile)} src={props.profile.photoURL} style={props.isOwnMessage ? {marginRight: "0.5rem"}: {marginLeft: "0.5rem"}}/>
            </div>
            <div className={"chatbox-cloud"} style={{ marginRight: "0.3rem", marginLeft: "0.5rem", minWidth:    "3.9rem", width: "auto", flex: "min-content"}}>
                                    <span style={props.isOwnMessage ? {textAlign: "right", width: "auto"}: {background: "papayawhip"}}>
                                        {props.message.text}</span>
            </div>
        </div>
    )
}