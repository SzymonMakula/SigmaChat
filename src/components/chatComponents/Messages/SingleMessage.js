
export default function SingleMessage(props){

    return (
        <div className={"chatbox-message-window"}
             style={props.isOwnMessage ? {flexDirection: "row-reverse", marginBottom: "0.8rem"} : {marginBottom: "0.8rem"}}>
            <div className={"chatbox-profile"}>
                <img onClick={() => {props.setProfileToShow(props.profile); }} src={props.profile.photoURL}
                     style={props.isOwnMessage ? {marginRight: "0.5rem"} : {}}/>
            </div>
            <div className={"chatbox-cloud"} style={props.isOwnMessage ? {
                marginRight: "0.3rem",
                minWidth: "4rem",
                width: "auto",
                flex: "min-content"
            } : {}}>
            <span style={props.isOwnMessage ? {textAlign: "right", width: "auto"} : {background: "papayawhip"}}>
                <text style={props.isOwnMessage ? {marginLeft: "auto"} : {}}>{props.profile.displayName}</text>
                {props.message.text}
            </span>
            </div>
        </div>
    )

}