import React, {Suspense, useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {firestore, storage} from "../../firebase";
import {useCollectionData} from "react-firebase-hooks/firestore"
import {useAuth} from "../../context/AuthContext";
import "./SearchRooms.css";
import * as PropTypes from "prop-types";
import {forEach} from "react-bootstrap/ElementChildren";

function ChatRoom(props) {
    const {Name} = props.room
    return <p>{Name}</p>
}

ChatRoom.propTypes = {children: PropTypes.node};
export default function SearchRooms(){

    const storageRef = storage.ref();
    const chatRoomsRef = firestore.collection('chatRooms')
    const [rooms, setRooms] = useState([]);
    const [logos, setlogos] = useState();
    const history = useHistory();

    const [loading, setLoading] = useState(true);



    async function getChatRooms(){
        const snapshot = await firestore.collection('chatRooms').get();
        return Promise.resolve(snapshot)
    }
    async function loadLogos(){
        let urls = await storageRef.child("logos/").list().then(item => item.items.map(sth => sth.getDownloadURL()));
        return Promise.all(urls)
    }



    useEffect(() => {
     getChatRooms().then(result => {
         loadLogos().then(collection => {
                 let logos = [];
                 collection.map(logo =>{
                     logos.push(logo);
                 });
                 setlogos(logos)
             }
         )
            let data = [];
            result.docs.map(doc => data.push(doc.data()));
            setRooms(data)
            setLoading(false)
        })
    console.log("render")
    },[])



    return(
        <div className={"searchbox"}>
            <div className="searchbox-title-row">
                <span className={"w-100 text-center align-self-center"}>ACTIVE CHAT ROOMS</span>
            </div>
            {!loading && logos && rooms.map(room =>
                (<button onClick={() => history.push(`/chatrooms/${room.roomId}`)} className="room-info-box">
                    <div className="chatroom-logo-box">
                        <img src={logos[room.Logo]}/>
                    </div>
                    <div className="chatroom-name-box">
                        <span>{room.Name}</span>
                    </div>
                    <div className="chatroom-desc-box">
                        <span>{room.Description}</span>
                    </div>
                </button>))}

        </div>


    )

}


