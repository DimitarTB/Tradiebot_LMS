import React, { Fragment, useEffect } from 'react'
import './App.css'
import Container from "./Components/Global/Container"
import Nav from "./Components/Global/Nav/Nav"
import Landing from "./Components/Landing/Landing.js"
import Profile from "./Components/User/Profile"
import BrowseCourses from "./Components/Courses/BrowseCourses"
import CreateCourse from "./Components/Courses/CreateCourse"
import CreatedCourses from "./Components/Courses/CreatedCourses"
import TeachingCourses from "./Components/Courses/TeachingCourses"

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import EnrolledCourses from './Components/Courses/EnrolledCourses'
import CourseComponent from "./Components/Courses/CourseComponent"
import CourseContainer from "./Components/Courses/CourseContent/CourseContainer"

function App() {

    const user = useSelector(state => state.user)

    const dispatch = useDispatch()

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
                    <Route path="/course/:course_id">
                        <CourseContainer />
                    </Route>
                    <Route path="/user/:username">
                        <Profile></Profile>
                    </Route>
                    <Route path="/courses/created">
                        <CreatedCourses />
                    </Route>
                    <Route path="/courses/teaching">
                        <TeachingCourses />
                    </Route>
                    <Route path="/courses/enrolled">
                        <EnrolledCourses />
                    </Route>
                    <Route path="/courses/browse">
                        <BrowseCourses />
                    </Route>
                    <Route path="/courses/create">
                        <CreateCourse />
                    </Route>
                    
                    <Route path="/logout">
                        {() => {dispatch({ type: 'user/logout' })}}
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