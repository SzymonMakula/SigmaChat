import {BrowserRouter as Router, Switch, Route, useRouteMatch, Link, Redirect} from "react-router-dom"
import Dashboard from "./Dashboard";
import EditProfile from "./profileComponents/EditProfile";
import React from "react";
import PrivateRoute from "./LoginComponents/PrivateRoute";
import ChangeProfileEmail from "./profileComponents/ChangeProfileEmail";


export default function MainOverlay(){
    let { path, url } = useRouteMatch();


    return(
        <div className="overlay">
            <Switch>
                <PrivateRoute path={`/edit-profile/email`} component={ChangeProfileEmail}/>
                <Route path="/" component={Dashboard}/>
            </Switch>
        </div>

    )

}
