import React from "react";

export default function FirstMessage(props){
    return(
        <div className={"chatbox-message-window"} style={props.isOwnMessage ? {flexDirection: "row-reverse"} : {}} >
            <div className={"chatbox-profile"} style={{minWidth: "3.7rem"}}>
            </div>
            <div className={"chatbox-cloud"} style={{ marginRight: "0.3rem", marginLeft: "0.3rem", minWidth:    "3.9rem", width: "auto", flex: "min-content",  marginTop: "0rem"}}>
                                    <span style={props.isOwnMessage ? {textAlign: "right", width: "auto"}: {background: "papayawhip"}}>
                                         <text style={props.isOwnMessage ?{marginLeft: "auto"} : {}}>{props.profile.displayName}</text>
                                        {props.message.text}</span>
            </div>
        </div>
    )
}