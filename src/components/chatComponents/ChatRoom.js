import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { database } from '../../firebase';
import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';

import '../../styles/ChatRoom.css';
import { useAuth } from '../../context/AuthContext';
import LastMessage from './Messages/LastMessage';
import RepeatedMessage from './Messages/RepeatedMessage';
import FirstMessage from './Messages/FirstMessage';
import ViewProfile from './ViewProfile';
import SingleMessage from './Messages/SingleMessage';
import ViewPeople from './ViewPeople';

export default function ChatRoom() {
    const databaseRef = database.ref();
    const history = useHistory();
    const dummy = useRef();
    const chatboxRef = useRef();
    let { roomId } = useParams();
    const { currentUser } = useAuth();
    const inputRef = useRef();
    const [profileToShow, setProfileToShow] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [roomInfo, setRoomInfo] = useState();
    const [isDesktop, setIsDesktop] = useState();
    const [messages, setMessages] = useState(null);
    const [showSubmit, setShowSubmit] = useState(true);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [users, setUsers] = useState(null);
    var scrollPosition;
    var scheduled;

    function scrollBottomAtStart() {
        if (!scrolled && messages) {
            dummy.current.scrollIntoView();
            console.log('page loaded');
            setScrolled(true);
        }
    }

    function handleScroll(event) {
        //scroll is lagged. Scroll button renders twice and lags a bit whenever his state changes.
        if (!scheduled && chatboxRef) {
            setTimeout(() => {
                try {
                    scrollPosition =
                        chatboxRef.current.scrollHeight -
                        chatboxRef.current.scrollTop -
                        chatboxRef.current.offsetHeight;
                    if (scrollPosition > 500) return setShowScrollButton(true);
                    setShowScrollButton(false);
                    scheduled = null;
                } catch (err) {
                    console.log('error');
                }
            }, 250);
        }
        scheduled = event;
    }

    function handleSubmit(e) {
        let id = generateUniqueID();
        e.preventDefault();
        let message = {
            authorId: currentUser.uid,
            text: inputRef.current.value,
            timestamp: Date.now(),
            uid: generateUniqueID(),
        };
        if (inputRef.current.value.length !== 0) {
            // eslint-disable-next-line no-unused-vars
            databaseRef
                .child(`messages/${roomId}/${id}`)
                .set(message)
                .then(() => {
                    inputRef.current.value = '';
                    setShowSubmit(false);
                    console.log('scrolling');
                    dummy.current.scrollIntoView({ behavior: 'smooth' });
                });
        }
    }

    async function getUserFromId(id) {
        let userData;
        await databaseRef.child(`users/${id}`).once('value', (snap) => {
            userData = snap.val();
        });
        return await userData;
    }

    async function loadUsersFromMessages(messages) {
        let usersData = [];
        let ids = [];
        for (let message of messages) {
            if (!ids.includes(message.authorId)) ids.push(message.authorId);
        }
        for (let id of ids) {
            usersData.push(await getUserFromId(id));
        }
        return usersData;
    }

    async function getRoomInfo() {
        let roomData;
        await databaseRef
            .child('chatRooms')
            .once('value', (data) => (roomData = data.val()));
        if (!(roomId in Object.keys(roomData))) return;
        return setRoomInfo(roomData[roomId]);
    }
    async function loadChat() {
        await databaseRef.child(`messages/${roomId}`).once('value', (snap) => {
            var t0 = performance.now();
            let messageList = [];
            let msgs = snap.val();
            if (msgs != null) {
                for (let id of Object.keys(msgs)) {
                    messageList.push(msgs[id]);
                }
                loadUsersFromMessages(messageList).then((profileList) => {
                    for (let profile of profileList) {
                        messageList = messageList.map((message) => {
                            if (message.authorId === profile.uid)
                                message.profile = profile;
                            return message;
                        });
                    }
                    setUsers([...profileList]);
                    setMessages([...messageList]);
                });
            }
            var t1 = performance.now();
            console.log(
                'Call to render messages took ' + (t1 - t0) + ' milliseconds.'
            );
        });
    }
    function updateMessages() {
        // serious bug here. This doesnt get fired upon hosting new room, causing the messages sent not to be displayed
        // if somebody sends a message, and you refresh the page,  it gets displayed, but when you try to send a message
        // it doesnt load user profile to it. After refreshing the page works as intended. Probably something with
        // async fetching user Data. Look into it ASAP
        let skipQuery = true;
        databaseRef
            .child(`messages/${roomId}`)
            .endAt()
            .limitToLast(1)
            .on('child_added', (snap) => {
                var t0 = performance.now();
                if (!loading && !skipQuery) {
                    let msg = snap.val();
                    let authorId = msg.authorId;
                    let userList = [...users];
                    if (!userList.some((user) => user.uid === authorId)) {
                        Promise.resolve(getUserFromId(authorId)).then(
                            (newUser) => userList.push(newUser)
                        );
                    }
                    msg.profile = userList.filter(
                        (user) => user.uid === authorId
                    )[0];
                    if (msg.profile) {
                        let messageList = messages;
                        messageList.push(msg);
                        setMessages([...messageList]);
                        setUsers([...userList]);
                    }
                }
                skipQuery = false;
                var t1 = performance.now();
                console.log(
                    'Call to update messages took ' +
                        (t1 - t0) +
                        ' milliseconds.'
                );
            });
    }

    useEffect(() => {
        if (window.matchMedia('(min-width: 600px)').matches) setIsDesktop(true);
        // eslint-disable-next-line no-unused-vars
        Promise.all([getRoomInfo(), loadChat()]).then(() => {
            setLoading(false);
        });

        return () => {
            console.log('returning');
            databaseRef
                .child(`messages/${roomId}`)
                .endAt()
                .limitToLast(1)
                .off('child_added');
            databaseRef.child(`messages/${roomId}`).off('value');
            //probably safe to delete?
            setRoomInfo(null);
            setLoading(true);
            setRoomInfo(null);
            setUsers(null);
            setMessages(null);
            setScrolled(false);
            setShowScrollButton(false);
        };
    }, [roomId]);

    useEffect(() => {
        console.log('using effect');
        if (!loading) {
            console.log('running function');
            updateMessages();
        }
    }, [scrolled]);

    return (
        <div className={'chatbox-container'}>
            {loading && (
                <div className={'loading-container'} style={{ left: '45%' }}>
                    <div className="spinner-border text-dark" role="status" />
                    <span>Loading...</span>
                </div>
            )}
            <div className="column-container chatbox">
                <div className="nav-tab">
                    <button onClick={() => history.push('/')}>
                        <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="chevron-left"
                            className="svg-inline--fa fa-chevron-left fa-w-10"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                        >
                            <path
                                fill="currentColor"
                                d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"
                            />
                        </svg>
                    </button>
                    {roomInfo && (
                        <h2 style={{ textAlign: 'left' }}>{roomInfo.Name}</h2>
                    )}
                </div>
                <div
                    className="chatbox-main"
                    style={{ visibility: scrolled ? 'visible' : 'hidden' }}
                    ref={chatboxRef}
                    onLoad={() => scrollBottomAtStart()}
                    onScroll={() => handleScroll()}
                    onClick={() => {
                        if (profileToShow) setProfileToShow(null);
                    }}
                >
                    {messages &&
                        !messages.some(
                            (message) => message.profile === undefined
                        ) &&
                        messages.map((message, index) => {
                            // Maps over array of messages in JSON format. Format messages differently for first, last,
                            // repeated and regular (one time) messages.
                            let isOwnMessage =
                                message.authorId === currentUser.uid;
                            let profile;
                            profile = message.profile;

                            if (
                                index + 1 < messages.length &&
                                messages[index + 1].authorId ===
                                    message.authorId
                            ) {
                                if (
                                    (messages[index - 1] &&
                                        messages[index - 1].authorId !==
                                            message.authorId) ||
                                    !messages[index - 1]
                                )
                                    return (
                                        <FirstMessage
                                            key={message.uid}
                                            isOwnMessage={isOwnMessage}
                                            message={message}
                                            profile={profile}
                                        />
                                    );
                                return (
                                    <RepeatedMessage
                                        key={message.uid}
                                        isOwnMessage={isOwnMessage}
                                        message={message}
                                        profile={profile}
                                    />
                                );
                            }
                            if (
                                messages[index - 1] &&
                                messages[index - 1].authorId ===
                                    message.authorId
                            ) {
                                return (
                                    <LastMessage
                                        key={message.uid}
                                        setProfileToShow={setProfileToShow}
                                        isOwnMessage={isOwnMessage}
                                        message={message}
                                        profile={profile}
                                    />
                                );
                            }
                            return (
                                <SingleMessage
                                    key={message.uid}
                                    setProfileToShow={setProfileToShow}
                                    isOwnMessage={isOwnMessage}
                                    message={message}
                                    profile={profile}
                                />
                            );
                        })}
                    <div ref={dummy} />
                </div>
                {profileToShow && (
                    <ViewProfile
                        chatboxRef={chatboxRef}
                        message={profileToShow}
                        profile={profileToShow}
                        setProfileToShow={setProfileToShow}
                    />
                )}
                <div className={'chatbox-input-row'}>
                    <form onSubmit={(event) => handleSubmit(event)}>
                        <div className={'message-input-cloud'}>
                            <input
                                placeholder={'Your message...'}
                                onSubmit={(e) => handleSubmit(e)}
                                minLength={'1'}
                                maxLength={'256'}
                                ref={inputRef}
                            />
                        </div>
                        {!showSubmit ? (
                            <button>
                                <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="camera-retro"
                                    className="svg-inline--fa fa-camera-retro fa-w-16"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M48 32C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zm0 32h106c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H38c-3.3 0-6-2.7-6-6V80c0-8.8 7.2-16 16-16zm426 96H38c-3.3 0-6-2.7-6-6v-36c0-3.3 2.7-6 6-6h138l30.2-45.3c1.1-1.7 3-2.7 5-2.7H464c8.8 0 16 7.2 16 16v74c0 3.3-2.7 6-6 6zM256 424c-66.2 0-120-53.8-120-120s53.8-120 120-120 120 53.8 120 120-53.8 120-120 120zm0-208c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88zm-48 104c-8.8 0-16-7.2-16-16 0-35.3 28.7-64 64-64 8.8 0 16 7.2 16 16s-7.2 16-16 16c-17.6 0-32 14.4-32 32 0 8.8-7.2 16-16 16z"
                                    />
                                </svg>
                            </button>
                        ) : (
                            <button onClick={(e) => handleSubmit(e)}>
                                <svg
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="paper-plane"
                                    className="svg-inline--fa fa-paper-plane fa-w-16"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
                                    />
                                </svg>
                            </button>
                        )}
                    </form>
                    <button
                        onClick={() =>
                            dummy.current.scrollIntoView({ behavior: 'smooth' })
                        }
                        className={'scroll-to-newest-button'}
                        style={{
                            opacity: showScrollButton ? '100' : '0',
                            visibility: showScrollButton ? 'visible' : 'hidden',
                        }}
                    >
                        <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="chevron-circle-down"
                            className="svg-inline--fa fa-chevron-circle-down fa-w-16"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path
                                fill="currentColor"
                                d="M504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zM273 369.9l135.5-135.5c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L256 285.1 154.4 183.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L239 369.9c9.4 9.4 24.6 9.4 34 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {isDesktop && (
                <ViewPeople
                    loading={loading}
                    setProfileToShow={setProfileToShow}
                    users={users}
                />
            )}
        </div>
    );
}
