import React, { Fragment, useEffect } from 'react'
import './App.css'
import Container from "./Components/Global/Container"
import Nav from "./Components/Global/Nav/Nav"
import Landing from "./Components/Landing/Landing.js"

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom"
import { useSelector } from 'react-redux'

function App() {

    const user = useSelector(state => state.user)



    return (
        <div className="App">
            <Router>
                {user.currentUser === null ? <Redirect to="/" /> : <Nav />}
                <Switch>
                    <Route path="/home">
                        <Container
                            details="Default Container Details"
                            description="Description about default container details"

                            component={(
                                <Fragment>
                                    <h1>Hello World</h1>
                                    <h2>H2 tag</h2>
                                    <h3>Hello again</h3>
                                </Fragment>
                            )}
                        />
                    </Route>

                    <Route path="/">
                        <Landing />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App