import React, { Fragment, useEffect } from 'react'
import './App.css'
import Container from "./Components/Global/Container"
import Nav from "./Components/Global/Nav/Nav"
import Landing from "./Components/Landing/Landing.js"
import Profile from "./Components/User/Profile"
import BrowseCourses from "./Components/Courses/BrowseCourses"
import CreateCourse from "./Components/Courses/Forms/CreateCourse"
import CreatedCourses from "./Components/Courses/CreatedCourses"
import TeachingCourses from "./Components/Courses/TeachingCourses"
import EditCourse from "./Components/Courses/Forms/EditCourse"
import EditLecture from "./Components/Courses/Forms/EditLecture"
import Register from "./Components/Landing/Register"

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    DefaultRoute
} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import EnrolledCourses from './Components/Courses/EnrolledCourses'
import CourseComponent from "./Components/Courses/CourseComponent"
import CourseContainer from "./Components/Courses/CourseContent/CourseContainer"
import { getAllCourses } from './redux/Courses/CoursesActions'
import NotActivated from './Components/Landing/NotActivated'
import ChangePassword from './Components/Landing/ChangePassword'
import SubmitToken from './Components/Landing/SubmitToken'
import { fetchAll } from './redux/Users/UserActions'

function App() {

    const user = useSelector(state => state.user)

    const dispatch = useDispatch()

    return (
        <div className="App">
            <Router>
                {user?.currentUser === null ? <>
                    <Route path="/submit_token">
                        <SubmitToken />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/change_password">
                        <ChangePassword />
                    </Route>
                </> : <Nav />}
                {user?.currentUserData?.activated === false ? <Redirect to="/not_activated" /> : <Nav />}
                <Switch>
                    <Route path="/not_activated">
                        <NotActivated user={user.currentUserData?.username} />
                    </Route>
                    <Route path="/logout">
                        {() => { dispatch({ type: 'user/logout' }) }}
                    </Route>
                    {user?.currentUserData?.activated === false ? <Redirect to="/not_activated" /> : (<>
                        <Route path="/home">
                            <Container
                                details={"Default Container Details"}
                                description="Description about default container details"

                                component={(
                                    <Fragment>
                                        <h1>Hello World</h1>
                                        <h2>H2 tag</h2>
                                        <h3>Hello again</h3>
                                    </Fragment>
                                )}
                            >
                            </Container>
                        </Route>
                        <Route path="/course/:course_id">
                            <CourseContainer />
                        </Route>

                        <Route path="/user/:username">
                            <Profile></Profile>
                        </Route>
                        <Route path="/courses/edit/:id">
                            <EditCourse></EditCourse>
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
                        <Route path="/lectures/edit/:id">
                            <EditLecture></EditLecture>
                        </Route>
                        <Route exact path="/">
                            {user?.currentUser === null ? <Landing /> : <Redirect to="/home" />}
                        </Route>
                    </>)}

                </Switch>
            </Router>
        </div>
    )
}

export default App