import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { database } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import '../../styles/FriendsList.css'
import ArrowBackSvg from '../svgs/ArrowBackSvg'
import CrossFriendSvg from '../svgs/CrossFriendSvg'

export default function FriendsList() {
    const databaseRef = database.ref()
    const history = useHistory()
    const { currentUser } = useAuth()
    const [friends, setFriends] = useState()

    async function removeFriend(id) {
        await databaseRef
            .child(`users/${currentUser.uid}/friends/${id}`)
            .remove()
        await loadFriends()
    }

    async function loadFriends() {
        let friendsIds = []
        let friendsData = []
        await databaseRef
            .child(`users/${currentUser.uid}/friends`)
            .once('value', (snap) => {
                let data = snap.val()
                if (data) {
                    friendsIds.push(Object.keys(data))
                    friendsIds = friendsIds.flat()
                }
            })
        await databaseRef.child(`users/`).once('value', (snap) => {
            let data = snap.val()
            for (let friendId of friendsIds) {
                friendsData.push(data[friendId])
            }
        })
        setFriends(friendsData)
    }

    useEffect(() => {
        Promise.resolve(loadFriends())
    }, [])

    return (
        <>
            {friends && (
                <div
                    className={'column-container'}
                    style={{ height: '100%', background: 'lightsteelblue' }}
                >
                    <div className="nav-tab">
                        <button onClick={() => history.push('/')}>
                            <ArrowBackSvg />
                        </button>
                        <h2 style={{ textAlign: 'left' }}>My Friend List</h2>
                    </div>
                    <div
                        className={'main-column'}
                        style={{ overflowY: 'auto' }}
                    >
                        {friends.length === 0 && (
                            <span id={'no-friends-message'}>
                                No friends to show. Go on, chat and get some
                                friends!
                            </span>
                        )}
                        {friends.map((friend) => {
                            return (
                                <div className={'friend-box'} key={friend.uid}>
                                    <div className={'friend-picture'}>
                                        <img src={friend.photoURL} />
                                    </div>
                                    <span>{friend.displayName}</span>
                                    <div
                                        className={
                                            'flex-row justify-content-end w-100'
                                        }
                                        style={{ display: 'flex' }}
                                    >
                                        <button
                                            onClick={() =>
                                                removeFriend(friend.uid)
                                            }
                                        >
                                            <CrossFriendSvg />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}
