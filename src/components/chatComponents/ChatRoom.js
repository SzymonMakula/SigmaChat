import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';
import { debounce } from 'lodash';

import { database } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import LastMessage from './Messages/LastMessage';
import RepeatedMessage from './Messages/RepeatedMessage';
import FirstMessage from './Messages/FirstMessage';
import ViewProfile from './ViewProfile';
import SingleMessage from './Messages/SingleMessage';
import ViewPeople from './ViewPeople';
import LoadingCircle from '../loadingBars/LoadingCircle';
import ArrowBackSvg from '../svgs/ArrowBackSvg';
import { useApp } from '../App';
import PaperplaneSvg from '../svgs/PaperplaneSvg';
import '../../styles/ChatRoom.css';
import { Alert } from 'react-bootstrap';

const useMessages = (roomId) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const databaseRef = database.ref();
    let userList = [];
    let messageList = [];

    const listenForMessages = () => {
        databaseRef
            .child(`messages/${roomId}`)
            .on('child_added', async (snap) => {
                const message = snap.val();
                const userId = message.authorId;
                const userData =
                    userList.find((user) => message.authorId === user.uid) ||
                    (await databaseRef.child(`users/${userId}`).get()).val();
                message.profile = userData;
                if (!userList.find((user) => user.uid === userId))
                    userList = [...userList, userData];
                messageList = [...messageList, message];
                setUsers(userList);
                setMessages(messageList);
            });
    };

    useEffect(() => {
        listenForMessages();
    }, [roomId]);

    return { messages, users };
};

const useChatRoom = (roomId) => {
    const databaseRef = database.ref();
    const [roomData, setRoomData] = useState([]);

    useEffect(() => {
        databaseRef
            .child(`chatRooms/${roomId}`)
            .once('value', (data) => {
                if (data.val()) setRoomData(data.val());
            })
            .catch((error) => console.log(error));
    }, [roomId]);
    return { roomData };
};

export default function ChatRoom() {
    const dummy = useRef();
    const chatboxRef = useRef();
    const databaseRef = database.ref();
    const { roomId } = useParams();
    const { isDesktop } = useApp();
    const { currentUser } = useAuth();
    const { roomData } = useChatRoom(roomId);
    const { messages } = useMessages(roomId);
    const { users } = useMessages(roomId);
    const history = useHistory();
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profileToShow, setProfileToShow] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    let scrollPosition;

    function scrollBottomAtStart() {
        setTimeout(() => {
            dummy.current.scrollIntoView();
            setLoading(false);
        }, 400);
    }

    function handleScroll() {
        if (chatboxRef.current) {
            scrollPosition =
                chatboxRef.current.scrollHeight -
                chatboxRef.current.scrollTop -
                chatboxRef.current.offsetHeight;
            if (scrollPosition > 500) return setShowScrollButton(true);
            setShowScrollButton(false);
        }
    }
    const debounceScroll = debounce(handleScroll, 150);

    async function handleSubmit(e) {
        e.preventDefault();
        const id = generateUniqueID();
        const message = {
            authorId: currentUser.uid,
            text: inputMessage,
            timestamp: Date.now(),
            uid: id,
        };
        if (inputMessage.length > 1) {
            try {
                await databaseRef
                    .child(`messages/${roomId}/${id}`)
                    .set(message);
                setInputMessage('');
                dummy.current.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                setError(error.message);
            }
        }
        setError('');
    }
    useEffect(() => {
        scrollBottomAtStart();
        return setLoading(true);
    }, [roomId]);

    return (
        <div className={'chatbox-container'}>
            {loading && <LoadingCircle />}
            <div className="column-container chatbox">
                <div className="nav-tab">
                    <button onClick={() => history.push('/')}>
                        <ArrowBackSvg />
                    </button>
                    <h2 style={{ textAlign: 'left' }}>{roomData.Name}</h2>
                </div>
                <div
                    className="chatbox-main"
                    ref={chatboxRef}
                    style={{ visibility: loading ? 'hidden' : 'visible' }}
                    onScroll={debounceScroll}
                    onLoad={scrollBottomAtStart}
                    onClick={() => {
                        if (profileToShow) setProfileToShow(null);
                    }}
                >
                    {messages.map((message, index) => {
                        // Maps over array of messages in JSON format. Format messages differently for first, last,
                        // repeated and regular (one time) messages.
                        let isOwnMessage = message.authorId === currentUser.uid;
                        let profile;
                        profile = message.profile;

                        if (
                            index + 1 < messages.length &&
                            messages[index + 1].authorId === message.authorId
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
                            messages[index - 1].authorId === message.authorId
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
                    {error && <Alert variant="danger">{error}</Alert>}
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
                    <form onSubmit={handleSubmit}>
                        <div className={'message-input-cloud'}>
                            <input
                                onChange={(event) =>
                                    setInputMessage(event.target.value)
                                }
                                value={inputMessage}
                                placeholder={'Your message...'}
                                onSubmit={handleSubmit}
                                minLength={'2'}
                                maxLength={'256'}
                            />
                        </div>
                        <button onClick={(e) => handleSubmit(e)}>
                            <PaperplaneSvg />
                        </button>
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
