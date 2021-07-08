import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Alert, Form } from 'react-bootstrap'
import '../../styles/HostRoom.css'
import { useAuth } from '../../context/AuthContext'
import { storage, database } from '../../firebase'
import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID'
import ArrowBackSvg from '../svgs/ArrowBackSvg'
import CheckSvg from '../svgs/CheckSvg'
import ArrowRightSvg from '../svgs/ArrowRightSvg'
import LoadingCircle from '../loadingBars/LoadingCircle'

export default function HostRoom() {
    const [roomName, setRoomName] = useState('')
    const [description, setDescription] = useState('')
    const storageRef = storage.ref()
    const databaseRef = database.ref()
    const { currentUser } = useAuth()
    const [logos, setlogos] = useState()
    const [index, setIndex] = useState(2)
    const [currentAnimation, setAnimation] = useState('none')
    const [loading, setLoading] = useState(false)
    const [playingAnimation, setPlaying] = useState(false)
    const [error, setError] = useState('')
    const history = useHistory()
    let timeouts = []

    async function createRoom(id) {
        let roomExists
        await databaseRef.child('chatRooms').once('value', (snap) => {
            let rooms = snap.val()
            if (rooms) {
                const roomsArray = Object.keys(rooms).map((id) => rooms[id])
                const roomNames = roomsArray.map((room) => room.Name)
                if (roomNames.includes(roomName)) return (roomExists = true)
            }
        })
        if (roomExists) {
            setLoading(false)
            return setError(
                'Room with this name already exists. Please choose different name.'
            )
        }

        try {
            await databaseRef.child(`chatRooms/${id}`).set({
                roomId: id,
                Description: description,
                HostId: currentUser.uid,
                Logo: index,
                Name: roomName,
            })
            let room = {}
            room[roomName] = true
            await databaseRef.child('chatRoomNames/').update(room)
        } catch (error) {
            setLoading(false)
            return setError(error.message)
        }

        setError('')
        setLoading(false)
        history.push(`/chatrooms/${id}`)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        let id = generateUniqueID()
        await createRoom(id)
    }

    async function loadLogos() {
        let urls = await storageRef
            .child('logos/')
            .list()
            .then((item) => item.items.map((sth) => sth.getDownloadURL()))
        return Promise.all(urls)
    }

    useEffect(() => {
        loadLogos().then((collection) => {
            let logos = []
            collection.map((logo) => {
                logos.push(logo)
            })
            setlogos(logos)
        })
    }, [])

    function incrementIndex() {
        setPlaying(true)
        timeouts.push(setTimeout(() => setPlaying(false), 900))
        timeouts.push(
            setTimeout(
                () => setIndex(index < logos.length - 1 ? index + 1 : 0),
                450
            )
        )
    }
    function decrementIndex() {
        setPlaying(true)
        timeouts.push(setTimeout(() => setPlaying(false), 900))
        timeouts.push(
            setTimeout(
                () => setIndex(index > 0 ? index - 1 : logos.length - 1),
                450
            )
        )
    }

    function animate(direction) {
        setAnimation(`swipe-${direction} 0.9s forwards`)
        timeouts.push(setTimeout(() => setAnimation('none'), 900))
    }

    useEffect(() => {
        return timeouts.map((timeout) => clearTimeout(timeout))
    }, [])

    return (
        <div className="column-container host-room">
            <div className="nav-tab">
                <button onClick={() => history.push('/')}>
                    <ArrowBackSvg />
                </button>
                <h2>{'Host Room'}</h2>
                <button type={'submit'} form={'host-room-form'}>
                    <CheckSvg />
                </button>
            </div>
            {!logos && <LoadingCircle />}
            {logos && (
                <div className={'main-column'}>
                    <Form onSubmit={handleSubmit} id="host-room-form">
                        <Form.Group id="text" className={'room-info-row'}>
                            <input
                                onChange={(event) =>
                                    setRoomName(event.target.value)
                                }
                                className="editable-input"
                                type="text"
                                placeholder={'Your chat room name'}
                                required
                            />
                        </Form.Group>
                        <Form.Group id="text" className={'room-info-row'}>
                            <input
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                className="editable-input"
                                type="text"
                                placeholder={
                                    'Brief description of your chat room'
                                }
                                required
                            />
                        </Form.Group>
                    </Form>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <span>Chat room logo</span>
                    <div className={'logo-picker'}>
                        <button
                            disabled={playingAnimation}
                            onClick={() => {
                                animate('left')
                                decrementIndex()
                            }}
                        >
                            <ArrowBackSvg />
                        </button>
                        <div className={'current-logo'}>
                            <img
                                style={{
                                    animation: loading
                                        ? 'shake 0.8s forwards infinite'
                                        : currentAnimation,
                                }}
                                src={logos[index]}
                                alt={'Current Logo'}
                            />
                        </div>
                        <button
                            disabled={playingAnimation}
                            onClick={() => {
                                animate('right')
                                incrementIndex()
                            }}
                        >
                            <ArrowRightSvg />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
