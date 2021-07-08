import PropTypes from 'prop-types'
import React from 'react'

export default function SingleMessage(props) {
    return (
        <div
            className={'chatbox-message-window'}
            style={
                props.isOwnMessage
                    ? { flexDirection: 'row-reverse', marginBottom: '0.8rem' }
                    : { marginBottom: '0.8rem' }
            }
        >
            <div className={'chatbox-profile'}>
                <img
                    onClick={() => {
                        props.setProfileToShow(props.profile)
                    }}
                    src={props.profile.photoURL}
                />
            </div>
            <div className={'chatbox-cloud'}>
                <span
                    style={
                        props.isOwnMessage
                            ? { textAlign: 'right', alignSelf: 'flex-end' }
                            : {
                                  background: 'papayawhip',
                                  alignSelf: 'flex-start',
                              }
                    }
                >
                    <span>{props.profile.displayName}</span>
                    {props.message.text}
                </span>
            </div>
        </div>
    )
}

SingleMessage.propTypes = {
    setProfileToShow: PropTypes.func.isRequired,
    isOwnMessage: PropTypes.bool.isRequired,
    profile: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
}
