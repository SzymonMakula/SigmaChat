import React from 'react';
import PropTypes from 'prop-types';

export default function LastMessage(props) {
    return (
        <div
            className={'chatbox-message-window'}
            style={
                props.isOwnMessage
                    ? {
                          flexDirection: 'row-reverse',
                          alignItems: 'flex-start',
                          marginBottom: '0.8rem',
                      }
                    : { alignItems: 'flex-end', marginBottom: '0.8rem' }
            }
        >
            <div className={'chatbox-profile'}>
                <img
                    onClick={() => props.setProfileToShow(props.profile)}
                    src={props.profile.photoURL}
                    style={
                        props.isOwnMessage
                            ? { marginRight: '0.5rem' }
                            : { marginLeft: '0.5rem' }
                    }
                />
            </div>
            <div className={'chatbox-cloud'}>
                <span
                    style={
                        props.isOwnMessage ? {} : { background: 'papayawhip' }
                    }
                >
                    {props.message.text}
                </span>
            </div>
        </div>
    );
}
LastMessage.propTypes = {
    setProfileToShow: PropTypes.func.isRequired,
    isOwnMessage: PropTypes.bool.isRequired,
    profile: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
};
