import React, { useEffect, useState } from 'react'
import { Form, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import '../../styles/editProfile.css'
import { useAuth } from '../../context/AuthContext'
import { database, storage } from '../../firebase'
import { useApp } from '../App'
import ArrowBackSvg from '../svgs/ArrowBackSvg'
import LogoutSvg from '../svgs/LogoutSvg'
import classNames from 'classnames'

const useProfile = () => {
    const { currentUser } = useAuth()
    const [profile, setProfile] = useState()
    const databaseRef = database.ref()

    useEffect(() => {
        databaseRef.child(`users/${currentUser.uid}`).once('value', (snap) => {
            setProfile(snap.val())
        })
    }, [])
    return { profile }
}

export default function EditProfile() {
    const { currentUser, logout } = useAuth()
    const databaseRef = database.ref()
    const storageRef = storage.ref()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const history = useHistory()
    const { isDesktop } = useApp()
    const { profile } = useProfile()
    const [name, setName] = useState(currentUser.displayName)
    const [bio, setBio] = useState()
    const [userImage, setUserImage] = useState(currentUser.photoURL)
    const [isButtonActive, setButtonActive] = useState(false)
    const [uploadFile, setUploadFile] = useState()

    async function handleSubmit(e) {
        e.preventDefault()

        let imageUrl
        setLoading(true)
        setError('')
        setSuccess('')

        if (uploadFile) {
            let imageRef = storageRef.child(`images/${currentUser.uid}`)
            let uploadTask = await imageRef.put(uploadFile, null)
            imageUrl = await uploadTask.ref.getDownloadURL().then((url) => url)
        }
        if (currentUser.displayName === name && !imageUrl && !bio) {
            setLoading(false)
            setButtonActive(false)
            return setError(
                'New nickname must be different than the previous one.'
            )
        }
        if (bio === profile.bio) {
            setLoading(false)
            setButtonActive(false)
            return setError(
                'New biography must be different than the previous one'
            )
        }
        try {
            await currentUser.updateProfile({
                displayName: name,
                photoURL: imageUrl || currentUser.photoURL,
            })
            await databaseRef.child(`users/${currentUser.uid}`).update({
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                bio: bio || profile.bio,
            })
        } catch (error) {
            setButtonActive(false)
            return setError(error.message)
        }

        setSuccess('Profile updated successfully.')
        setButtonActive(false)
        setLoading(false)
    }

    function loadPicture(event) {
        if (event.target.files.length !== 0) {
            setUploadFile(event.target.files[0])
            setUserImage(URL.createObjectURL(event.target.files[0]))
            setButtonActive(true)
        }
    }

    return (
        <>
            {profile && (
                <div className="column-container profile-edit">
                    <div className="nav-tab">
                        <button onClick={() => history.push('/')}>
                            <ArrowBackSvg />
                        </button>
                        <h2>{'Edit profile'}</h2>
                        <button onClick={logout} style={{ marginLeft: 'auto' }}>
                            <LogoutSvg />
                            {isDesktop && <span>Logout</span>}
                        </button>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <div className="edit-profile-main">
                            <div className="edit-picture-frame">
                                <label
                                    className={'custom-picture-upload'}
                                    style={{
                                        backgroundImage: `url(${userImage})`,
                                    }}
                                >
                                    <text>Change picture</text>
                                    <input
                                        accept="image/*"
                                        name="image"
                                        type={'file'}
                                        onChange={loadPicture}
                                    />
                                </label>
                            </div>
                            <div className="edit-name-frame">
                                <Form.Group id="text">
                                    <input
                                        className="editable-input"
                                        type="text"
                                        onChange={(event) => {
                                            setButtonActive(true)
                                            setName(event.target.value)
                                            console.log(event.target.value)
                                            console.log(name)
                                        }}
                                        defaultValue={profile.displayName}
                                        minLength={'4'}
                                        maxLength={'16'}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            {error && isDesktop && (
                                <Alert variant="danger">{error}</Alert>
                            )}
                            {success && isDesktop && (
                                <Alert variant="success">{success}</Alert>
                            )}
                        </div>
                        <div className={'bio-container'}>
                            <span
                                style={{
                                    textAlign: 'left',
                                    fontSize: '1.4rem',
                                    marginTop: '0.7rem',
                                    marginLeft: '1rem',
                                    minHeight: '2rem',
                                }}
                            >
                                My bio:
                            </span>
                            <input
                                defaultValue={profile.bio}
                                onChange={(event) => {
                                    setButtonActive(true)
                                    setBio(event.target.value)
                                }}
                                minLength={'4'}
                                className={'editable-input'}
                                type={'text'}
                                style={{
                                    marginTop: '1.2rem',
                                    marginLeft: '1rem',
                                    alignSelf: 'center',
                                }}
                                placeholder={
                                    'Share a little bit about yourself'
                                }
                            />
                        </div>

                        <button
                            type={'submit'}
                            disabled={!isButtonActive}
                            className={classNames('edit-profile-button', {
                                'active-button': isButtonActive,
                            })}
                        >
                            <span>
                                {loading
                                    ? 'Updating Profile...'
                                    : 'Update Profile'}{' '}
                            </span>
                            <span
                                style={{
                                    display: loading ? 'inline-block' : 'none',
                                }}
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            />
                        </button>
                    </Form>
                    {error && !isDesktop && (
                        <Alert variant="danger">{error}</Alert>
                    )}
                    {success && !isDesktop && (
                        <Alert variant="success">{success}</Alert>
                    )}
                    <div className="big-buttons-container">
                        <button
                            className="change-credential-button"
                            onClick={() => history.push('/edit-profile/email')}
                        >
                            {'CHANGE EMAIL ADDRESS'}
                        </button>
                        <button
                            className="change-credential-button"
                            onClick={() =>
                                history.push('/edit-profile/password')
                            }
                        >
                            {'CHANGE PASSWORD'}
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
