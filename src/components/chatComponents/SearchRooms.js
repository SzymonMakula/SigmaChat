import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {storage, database} from "../../firebase";
import "./SearchRooms.css";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";


export default function SearchRooms(){

    const databaseRef = database.ref();
    const storageRef = storage.ref();
    const [logos, setLogos] = useState();
    const history = useHistory();
    const [chatRooms, setChatRooms] = useState();
    const [loading, setLoading] = useState(true);



    async function getChatRooms(){
        await databaseRef.on('value', snap => {
            let rooms = snap.val().chatRooms;
            let result = [];
            for (let id of Object.keys(rooms)){
                result.push(rooms[id])
            }

            Promise.resolve(setChatRooms(result))
            setLoading(false)
        });
    }
    async function loadLogos(){
        let urls = await storageRef.child("logos/").list().then(item => item.items.map(sth => sth.getDownloadURL()));
        return Promise.all(urls);
    }



    useEffect(() => {
         getChatRooms();
         loadLogos().then(logos => {
             setLogos(logos)
         })
        console.log("render")
    },[])



    return(
        <div className={"searchbox"}>
            <div className="searchbox-title-row">
                <span className={"w-100 text-center align-self-center"}>ACTIVE CHAT ROOMS</span>
            </div>
            {!loading && logos && chatRooms.map(room =>
                (<button key={generateUniqueID} onClick={() => history.push(`/chatrooms/${room.roomId}`)} className="room-info-box">
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


