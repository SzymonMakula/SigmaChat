import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

import '../../styles/ViewPeople.css';

export default function ViewPeople(props) {
    const { currentUser } = useAuth();
    // eslint-disable-next-line react/prop-types
    const users = props.users
        ? props.users.filter((user) => user.uid !== currentUser.uid)
        : null;

    return (
        <>
            <div
                className={
                    'chatters-list w-100 h-100 flex-column align-items-center'
                }
            >
                <div className={'nav-tab'}>
                    <h2 style={{ textAlign: 'left', marginLeft: '1rem' }}>
                        {'People Chatting'}
                    </h2>
                </div>
                <div className={'column-container'}>
                    {users &&
                        users.map((user) => (
                            <div
                                key={user.uid}
                                className={'chatter-cloud'}
                                onClick={() => props.setProfileToShow(user)}
                            >
                                <img src={user.photoURL} />
                                <span>{user.displayName}</span>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
ViewPeople.propTypes = {
    users: PropTypes.object.isRequired,
    setProfileToShow: PropTypes.func.isRequired,
};
