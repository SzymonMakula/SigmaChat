import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {storage, database} from "../../firebase";
import "../../styles/SearchRooms.css";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";


export default function SearchRooms(){

    const databaseRef = database.ref();
    const storageRef = storage.ref();
    const [logos, setLogos] = useState();
    const history = useHistory();
    const [chatRooms, setChatRooms] = useState();
    const [loading, setLoading] = useState(true);



    async function getChatRooms(){
        await databaseRef.child('chatRooms/').on('value', snap => {
            let result = [];

            try{
                let rooms = snap.val()
                for (let id of Object.keys(rooms)){
                    result.push(rooms[id])
                }
            }
            catch (err) {
                console.log(err)
            }
           setChatRooms(result)
        });


    }
    async function loadLogos(){
        let urls = await storageRef.child("logos/").list().then(item => item.items.map(sth => sth.getDownloadURL()));
        return Promise.all(urls);
    }
    function handleClick(id){
        let isDesktop = window.matchMedia("(min-width: 600px)").matches
        history.push(`/chatRooms/${id}`)
    }



    useEffect(() => {
        Promise.all([getChatRooms(), loadLogos()]).then(fulfill => {
            setLogos(fulfill[1]);
            setLoading(false)
        })

    },[])



    return(
        <div className={"searchbox"}>
            <div className="searchbox-title-row">
                <span className={"w-100 text-center align-self-center"}>ACTIVE CHAT ROOMS</span>
            </div>
            {!loading && chatRooms && chatRooms.map(room =>
                (<button key={generateUniqueID()} onClick={() => handleClick(room.roomId)} className="room-info-box">
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
            {loading &&
            <div className={"loading-container"}>
                <div className="spinner-border text-dark" role="status"/>
                <span>Loading...</span>
            </div>
            }
        </div>


    )

}


