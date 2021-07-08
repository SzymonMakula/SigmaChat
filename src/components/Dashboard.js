import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { useAuth } from '../context/AuthContext';
import Navbar from './Navbars/Navbar';
import SearchRooms from './chatComponents/SearchRooms';
import { database } from '../firebase';
import { useApp } from './App';
import DesktopRoutes from './Routes/DesktopRoutes';

export default function Dashboard() {
    const databaseRef = database.ref();
    const { currentUser } = useAuth();
    const { isDesktop } = useApp();
    const history = useHistory();
    const [isMenuGrayed, setMenuGrayed] = useState(false);

    async function firstTimeUpdate() {
        try {
            await currentUser.updateProfile({
                displayName: currentUser.email.match(/(.+)+?@/)[1],
                photoURL: defaultPhoto,
            });
            await databaseRef.child(`users/${currentUser.uid}`).set({
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        if (!currentUser.photoURL) firstTimeUpdate().catch((error) => error);
    }, []);

    return (
        <div className="overlay">
            {isDesktop ? (
                <BrowserRouter basename={'/desktop'} history={history}>
                    <Navbar setMenuBlurred={setMenuGrayed} />
                    <div
                        className={classNames('main', {
                            grayed: isMenuGrayed,
                        })}
                    >
                        <SearchRooms />
                        <DesktopRoutes />
                    </div>
                </BrowserRouter>
            ) : (
                <>
                    <Navbar setMenuBlurred={setMenuGrayed} />
                    <div
                        className={classNames('main', {
                            grayed: isMenuGrayed,
                        })}
                    >
                        <SearchRooms />
                    </div>
                </>
            )}
        </div>
    );
}
const defaultPhoto =
    'https://media.discordapp.net/attachments/87143400691728384/854039271161987122/qocke2uu64571.png?width=641&height=658';
