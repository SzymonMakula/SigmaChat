import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { database } from '../../firebase';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useAuth } from '../../context/AuthContext';
import '../../styles/ViewProfile.css';

export default function ViewProfile(props) {
    const databaseRef = database.ref();
    const [isFriend, setFriend] = useState();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    async function AddFriend(id) {
        let friend = {};
        friend[id] = true;
        try {
            await databaseRef
                .child(`users/${currentUser.uid}/friends`)
                .update(friend);
        } catch (error) {
            setFriend(false);
        }
        setFriend(true);
    }

    async function handleClick(event, id) {
        event.preventDefault();
        await AddFriend(id);
    }
    async function checkForFriend() {
        let friend;
        await databaseRef
            .child(`users/${currentUser.uid}/friends/${props.profile.uid}`)
            .once('value', (snap) => {
                if (currentUser.uid === props.profile.uid)
                    return (friend = true);
                friend = snap.val() != null;
            });
        setFriend(friend);
    }

    useEffect(() => {
        checkForFriend();
    }, [props.profile.uid]);

    useEffect(() => {
        if (isFriend !== undefined) setLoading(false);
    }, [isFriend]);

    return (
        <>
            {!loading && (
                <div
                    className={classNames('view-profile-container', {
                        'friend-profile': isFriend,
                    })}
                >
                    <div className={'view-profile-box'}>
                        <div className={'view-profile-picture'}>
                            <img src={props.profile.photoURL} />
                        </div>
                        <div className={'view-profile-info'}>
                            <span>{'Hello, my name is: '}</span>
                            <span
                                style={{
                                    color: 'steelblue',
                                    borderBottom: '0.2rem black solid',
                                }}
                            >
                                {props.profile.displayName}
                            </span>
                            <span style={{ fontSize: '1rem' }}>About me:</span>
                            <span style={{ fontSize: '0.7rem' }}>
                                {props.profile.bio}
                            </span>
                        </div>
                    </div>
                    {isFriend && props.profile.uid !== currentUser.uid && (
                        <span
                            style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: '1.4rem',
                            }}
                        >
                            {"We're friends already!"}
                        </span>
                    )}
                    <Button
                        className={'btn btn-outline-success'}
                        onClick={(event) => {
                            handleClick(event, props.profile.uid);
                        }}
                        style={{
                            display:
                                props.profile.uid === currentUser.uid ||
                                isFriend
                                    ? 'none'
                                    : 'inline-block',
                        }}
                    >
                        {'Add Friend'}
                    </Button>
                </div>
            )}
        </>
    );
}
ViewProfile.propTypes = {
    profile: PropTypes.object.isRequired,
};
