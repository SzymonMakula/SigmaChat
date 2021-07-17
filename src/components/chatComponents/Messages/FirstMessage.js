import React from 'react';
import PropTypes from 'prop-types';

export default function FirstMessage(props) {
    //change those into classnames!!!
    return (
        <div
            className={'chatbox-message-window'}
            style={props.isOwnMessage ? { flexDirection: 'row-reverse' } : {}}
        >
            <div className={'chatbox-profile'} />
            <div className={'chatbox-cloud'}>
                <span
                    style={
                        props.isOwnMessage
                            ? {}
                            : { background: 'papayawhip', textAlign: 'left' }
                    }
                >
                    <span>{props.profile.displayName}</span>
                    {props.message.text}
                </span>
            </div>
        </div>
    );
}
FirstMessage.propTypes = {
    isOwnMessage: PropTypes.bool.isRequired,
    profile: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
};
