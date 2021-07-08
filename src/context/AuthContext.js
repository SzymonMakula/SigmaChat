import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'
import firebase from 'firebase'
const AuthContext = React.createContext()
import PropTypes from 'prop-types'

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }
    function changePassword(password) {
        return auth.currentUser.updatePassword(password)
    }
    function changeMail(email) {
        return auth.currentUser.updateEmail(email)
    }

    function reauthenticate(password) {
        const credential = firebase.auth.EmailAuthProvider.credential(
            currentUser.email,
            password
        )
        return auth.currentUser.reauthenticateWithCredential(credential)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const AuthFunctions = {
        currentUser,
        login,
        signup,
        logout,
        changePassword,
        reauthenticate,
        changeMail,
    }

    return (
        <AuthContext.Provider value={AuthFunctions}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.object.isRequired,
}
