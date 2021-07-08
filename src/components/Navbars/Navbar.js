import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { throttle } from 'lodash';

import '../../styles/Navbar.css';
import '../../styles/MainMenu.css';
import { useAuth } from '../../context/AuthContext';
import PlusSvg from '../svgs/PlusSvg';
import FriendsSvg from '../svgs/FriendsSvg';
import CogSvg from '../svgs/CogSvg';
import BarsSvg from '../svgs/BarsSvg';
import { useApp } from '../App';

const useNavbarTouchHandlers = () => {
    let prevTouchPos;
    let currentTouchPos;

    const handleTouchMove = (event, closeMenu) => {
        currentTouchPos = event.touches[0].clientX;
        if (prevTouchPos > currentTouchPos && prevTouchPos !== undefined) {
            closeMenu();
        }
    };

    const handleTouch = (event) => {
        prevTouchPos = event.touches[0].clientX;
    };
    return { handleTouchMove, handleTouch };
};

export default function Navbar(props) {
    const { currentUser } = useAuth();
    const { isDesktop } = useApp();
    const [isNavOpen, setNavOpen] = useState(false);
    const history = useHistory();
    const { handleTouchMove, handleTouch } = useNavbarTouchHandlers();

    const userInfo = {
        name: currentUser.displayName,
        email: currentUser.email,
        photoUrl: currentUser.photoURL,
        emailVerified: currentUser.emailVerified,
        uid: currentUser.uid,
    };
    const userName = userInfo.name || userInfo.email.match(/(.+)+?@/)[1];
    const userPhoto = userInfo.photoUrl;

    function openMenu() {
        setNavOpen(true);
        props.setMenuBlurred(true);
    }

    function closeMenu() {
        setNavOpen(false);
        props.setMenuBlurred(false);
    }

    const handleTouchMoveThrottled = throttle(handleTouchMove, 250);

    return (
        <>
            <nav
                className={classNames(
                    'main-menu',
                    { 'main-menu-open': isNavOpen },
                    { 'main-menu-desktop': isDesktop && isNavOpen }
                )}
                onMouseLeave={closeMenu}
                onTouchMoveCapture={(event) =>
                    handleTouchMoveThrottled(event, closeMenu)
                }
                onTouchStart={handleTouch}
            >
                <div className="profile-bar">
                    <button
                        className="profile-picture-frame"
                        onClick={() => history.push('/edit-profile')}
                    >
                        <img src={userPhoto} className="profile-picture" />
                        <h1>{userName}</h1>
                    </button>
                </div>
                <div className="menu-nav">
                    <button
                        className="button-row"
                        onClick={() => history.push('/host-room')}
                    >
                        <PlusSvg />
                        <span>Host Chatroom</span>
                    </button>
                    <button
                        onClick={() => history.push('/friends')}
                        className="button-row"
                    >
                        <FriendsSvg />
                        <span>Friend List</span>
                    </button>
                    <button className="button-row">
                        <CogSvg />
                        <span>Options</span>
                    </button>
                </div>
            </nav>
            <nav className={classNames('navbar', { grayed: isNavOpen })}>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button
                            className="nav-link"
                            name="SearchRooms"
                            onClick={openMenu}
                        >
                            <BarsSvg />
                        </button>
                    </li>
                    <h2> {'SigmaChat'}</h2>
                </ul>
            </nav>
        </>
    );
}
Navbar.propTypes = {
    setMenuBlurred: PropTypes.func.isRequired,
};
