import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Signup from './LoginComponents/Signup';
import { AuthProvider } from '../context/AuthContext';
import Login from './LoginComponents/Login';
import PrivateRoute from './Routes/PrivateRoute';
import Dashboard from './Dashboard';
import MobileRoutes from './Routes/MobileRoutes';
import '../styles/App.css';

const AppContext = React.createContext();
export function useApp() {
    return useContext(AppContext);
}

function App() {
    const isDesktopProvider = {
        isDesktop: window.matchMedia('(min-width: 600px)').matches,
    };
    return (
        <AuthProvider>
            <AppContext.Provider value={isDesktopProvider}>
                <Router>
                    <Switch>
                        <Route path="/signup" component={Signup} />
                        <Route path="/login" component={Login} />
                        {isDesktopProvider.isDesktop && (
                            <PrivateRoute
                                exact
                                path="/desktop"
                                component={Dashboard}
                            />
                        )}
                        <MobileRoutes />
                    </Switch>
                </Router>
            </AppContext.Provider>
        </AuthProvider>
    );
}

export default App;
