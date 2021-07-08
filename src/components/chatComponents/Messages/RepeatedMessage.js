import React from 'react';
import PropTypes from 'prop-types';

export default function RepeatedMessage(props) {
    return (
        <div
            className={'chatbox-message-window'}
            style={props.isOwnMessage ? { flexDirection: 'row-reverse' } : {}}
        >
            <div className={'chatbox-profile'} />
            <div
                className={'chatbox-cloud'}
                style={{
                    marginTop: '0.05rem',
                }}
            >
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
RepeatedMessage.propTypes = {
    isOwnMessage: PropTypes.bool.isRequired,
    profile: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
};
