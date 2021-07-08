import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ component: Component, ...rest }) {
    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) => {
                return currentUser ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                );
            }}
        />
    );
}
PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
};
