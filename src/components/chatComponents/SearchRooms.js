import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { database, storage } from '../../firebase'
import '../../styles/SearchRooms.css'
import LoadingCircle from '../loadingBars/LoadingCircle'

export default function SearchRooms() {
    const databaseRef = database.ref()
    const storageRef = storage.ref()
    const [logos, setLogos] = useState()
    const history = useHistory()
    const [chatRooms, setChatRooms] = useState()
    const [loading, setLoading] = useState(true)

    async function getChatRooms() {
        await databaseRef.child('chatRooms/').on('value', (snap) => {
            const chatRoomsData = snap.val()
            const chatRooms =
                chatRoomsData !== null &&
                Object.keys(chatRoomsData).map((id) => chatRoomsData[id])
            setChatRooms(chatRooms)
        })
    }
    async function loadLogos() {
        let urls = await storageRef
            .child('logos/')
            .list()
            .then((item) => item.items.map((sth) => sth.getDownloadURL()))
        return Promise.all(urls)
    }
    function handleClick(id) {
        history.push(`/chatRooms/${id}`)
    }

    useEffect(() => {
        Promise.all([getChatRooms(), loadLogos()]).then((fulfill) => {
            setLogos(fulfill[1])
            setLoading(false)
        })
    }, [])

    return (
        <div className={'searchbox'}>
            <div className="searchbox-title-row">
                <span className={'w-100 text-center align-self-center'}>
                    {'ACTIVE CHAT ROOMS'}
                </span>
            </div>
            {!loading &&
                chatRooms &&
                chatRooms.map((room) => (
                    <button
                        key={room.roomId}
                        onClick={() => handleClick(room.roomId)}
                        className="room-info-box"
                    >
                        <div className="chatroom-logo-box">
                            <img src={logos[room.Logo]} />
                        </div>
                        <div className="chatroom-name-box">
                            <span>{room.Name}</span>
                        </div>
                        <div className="chatroom-desc-box">
                            <span>{room.Description}</span>
                        </div>
                    </button>
                ))}
            {loading && <LoadingCircle />}
        </div>
    )
}
