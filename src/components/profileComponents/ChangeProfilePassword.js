import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Alert, Button } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import ArrowBackSvg from '../svgs/ArrowBackSvg'
import classNames from 'classnames'

export default function ChangeProfilePassword() {
    const history = useHistory()
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { changePassword, reauthenticate } = useAuth()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isButtonActive, setButtonActive] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match')
        }
        try {
            await reauthenticate(oldPassword)
            await changePassword(newPassword)
        } catch (error) {
            setSuccess('')
            return setError(error.message)
        }

        setError('')
        setButtonActive(false)
        setSuccess('Successfully changed password')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    function handleButtonState() {
        if (
            newPassword.length > 0 &&
            confirmPassword.length > 0 &&
            oldPassword.length > 0
        )
            return setButtonActive(true)
        setButtonActive(false)
    }

    return (
        <div className="column-container profile-edit change-credential-container">
            <div className="nav-tab">
                <button onClick={() => history.push(`/edit-profile`)}>
                    <ArrowBackSvg />
                </button>
                <h2>{'Change password'}</h2>
            </div>
            <div className="w-100 h-100" style={{ marginTop: 'auto' }}>
                <form
                    className="reset-password-form"
                    onSubmit={handleSubmit}
                    onChange={handleButtonState}
                >
                    <span> {'CURRENT PASSWORD'}</span>
                    <input
                        onChange={(event) => setOldPassword(event.target.value)}
                        className={'editable-input'}
                        type="password"
                        placeholder={' 🔒 '}
                        required
                    />
                    <span> {'NEW PASSWORD'}</span>

                    <input
                        onChange={(event) => setNewPassword(event.target.value)}
                        className={'editable-input'}
                        type="password"
                        placeholder={' 🔒 '}
                        required
                    />
                    <span> {'CONFIRM NEW PASSWORD'}</span>

                    <input
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        className={'editable-input'}
                        type="password"
                        placeholder={' 🔒 '}
                        required
                    />
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Button
                        className={classNames(`btn btn-secondary`, {
                            'active-button': isButtonActive,
                        })}
                        type="submit"
                    >
                        {'CHANGE PASSWORD'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
