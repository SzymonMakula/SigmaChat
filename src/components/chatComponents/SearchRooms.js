import React, {Suspense, useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {firestore} from "../../firebase";
import {useCollectionData} from "react-firebase-hooks/firestore"
import {useAuth} from "../../context/AuthContext";
import "./SearchRooms.css";
import * as PropTypes from "prop-types";

function ChatRoom(props) {
    const {Name} = props.room
    return <p>{Name}</p>
}

ChatRoom.propTypes = {children: PropTypes.node};
export default function SearchRooms(){

    const chatRoomsRef = firestore.collection('chatRooms')
    const [rooms, setRooms] = useState({});
    const [loading, setLoading] = useState(true);



    async function getChatRooms(){
        const snapshot = await firestore.collection('chatRooms').get();
        let chatRooms = snapshot.forEach(doc =>  doc);
        return Promise.resolve(snapshot)

    }

    useEffect(() => {
    ( getChatRooms().then(result => {
            console.log(result.docs[1].data());
            setRooms(result.docs[1].data())
            setLoading(false)
        }))

    },[])



    return(
        <div className={"flex-grow-1"}>
            <div className="dupa">
                {!loading && <div>{rooms.Name}</div>}

            </div>
        </div>


    )

}


