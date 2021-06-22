import React from "react";

export default function RepeatedMessage(props){
    return(
        <div className={"chatbox-message-window"} style={props.isOwnMessage ?{flexDirection: "row-reverse"}: {}} >
            <div className={"chatbox-profile"} style={{minWidth: "3.7rem"}} >
            </div>
            <div className={"chatbox-cloud"} style={{marginRight: "0.3rem", marginLeft: "0.3rem", minWidth:    "3.9rem", width: "auto", flex: "min-content", marginTop: "0.05rem"}}>
                                    <span style={props.isOwnMessage ?{textAlign: "right", width: "auto"}: {background: "papayawhip"}}>
                                        {props.message.text}</span>
            </div>
        </div>
    )
}