import './LoginComponents/Signup'
import Signup from './LoginComponents/Signup'
import '../styles/App.css'
import { AuthProvider } from '../context/AuthContext'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './LoginComponents/Login'
import PrivateRoute from './Routes/PrivateRoute'
import React, { useContext } from 'react'
import Dashboard from './Dashboard'
import MobileRoutes from './Routes/MobileRoutes'

const AppContext = React.createContext()
export function useApp() {
    return useContext(AppContext)
}

function App() {
    const isDesktopProvider = {
        isDesktop: window.matchMedia('(min-width: 600px)').matches,
    }
    return (
        <AuthProvider>
            <AppContext.Provider value={isDesktopProvider}>
                <Router>
                    <Switch>
                        {isDesktopProvider.isDesktop && (
                            <PrivateRoute
                                exact
                                path="/desktop"
                                component={Dashboard}
                            />
                        )}
                        <MobileRoutes />
                        <Route path="/signup" component={Signup} />
                        <Route path="/login" component={Login} />
                    </Switch>
                </Router>
            </AppContext.Provider>
        </AuthProvider>
    )
}

export default App
