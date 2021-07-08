import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Alert, Button } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import ArrowBackSvg from '../svgs/ArrowBackSvg'
import classNames from 'classnames'

export default function ChangeProfileEmail() {
    const history = useHistory()
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [confirmEmail, setConfirmEmail] = useState('')
    const [isButtonActive, setButtonActive] = useState(false)
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const { changeMail, reauthenticate } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        if (email !== confirmEmail) return setError('Emails do not match.')

        try {
            await reauthenticate(password)
            await changeMail(email)
        } catch (error) {
            return setError(error.message)
        }
        setSuccess('Email Address has been changed successfully.')
        setError('')
        setButtonActive(false)
        setPassword('')
        setEmail('')
        setConfirmEmail('')
    }
    function handleButtonState() {
        if (password.length > 0 && email.length > 0 && confirmEmail.length > 0)
            return setButtonActive(true)
        setButtonActive(false)
    }

    return (
        <div className="column-container edit-profile change-credential-container">
            <div className="nav-tab">
                <button onClick={() => history.push(`/edit-profile`)}>
                    <ArrowBackSvg />
                </button>
                <h2>{'Edit Email Address'}</h2>
            </div>
            <div className="w-100 h-100" style={{ marginTop: 'auto' }}>
                <form
                    className="reset-password-form"
                    onSubmit={handleSubmit}
                    onChange={handleButtonState}
                >
                    <span> {'PASSWORD'}</span>

                    <input
                        onChange={(event) => setPassword(event.target.value)}
                        className={'editable-input'}
                        type="password"
                        placeholder={' 🔒 '}
                        required
                    />
                    <span> {'NEW EMAIL ADDRESS'}</span>

                    <input
                        onChange={(event) => setEmail(event.target.value)}
                        className={'editable-input'}
                        type="email"
                        placeholder={' ✉️  '}
                        required
                    />
                    <span> {'CONFIRM EMAIL ADDRESS'}</span>

                    <input
                        onChange={(event) =>
                            setConfirmEmail(event.target.value)
                        }
                        className={'editable-input'}
                        type="email"
                        placeholder={' ✉️  '}
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
                        {'CHANGE EMAIL'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
