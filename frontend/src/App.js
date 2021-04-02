import React, { Fragment, useState } from 'react'
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
    Redirect
} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import EnrolledCourses from './Components/Courses/EnrolledCourses'
import CourseContainer from "./Components/Courses/CourseContent/CourseContainer"
import NotActivated from './Components/Landing/NotActivated'
import ChangePassword from './Components/Landing/ChangePassword'
import SubmitToken from './Components/Landing/SubmitToken'
import TopicsTest from './Components/TopicsTest'
import EditTopic from './Components/Courses/Forms/EditTopic'
import EditQuiz from './Components/Courses/Forms/EditQuiz'
import PlastfixForm from './Components/Courses/Forms/PlastfixForm'
import QuizContainer from "./Components/Quiz/QuizContainer"
import Teachers from './Components/Landing/Teachers'
import CoursesTracking from './Components/Courses/CoursesTracking'
import SearchUsers from './Components/User/SearchUsers'
import PlastfixForm2 from './Components/Courses/Forms/PlastfixForm2'

function App() {

    const user = useSelector(state => state.user)
    const [redirect, setRedirect] = useState(false)

    const dispatch = useDispatch()

    const check_session = () => {
        if (user.currentUserData !== null) {
            console.log(typeof (user.currentUserData.token_exp), typeof (new Date()))
            if (Date.parse(user.currentUserData.token_exp) <= (new Date())) {
                setRedirect(true)
                dispatch({ type: 'user/logout' })
                alert('Your session has expired, please log in again!')
            }
        }
    }
    return redirect === true ? <Redirect to="/" /> : (
        <div className="App">
            <Router>
                {user?.currentUser === null ? <>
                    <Route path="/logout">
                        <Redirect to="/" />
                    </Route>
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
                {check_session()}
                {user?.currentUserData?.activated === false ? <Redirect to="/not_activated" /> : null}
                <Switch>
                    <Route path="/not_activated">
                        <NotActivated user={user.currentUserData?.username} activated={user.currentUserData?.activated} />
                    </Route>
                    <Route path="/logout">
                        {() => { dispatch({ type: 'user/logout' }) }}
                    </Route>

                    {user?.currentUserData?.activated === false ? <Redirect to="/not_activated" /> : (<>
                        <Route path="/home">
                            {() => check_session()}
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
                        <Route path="/quizzes/edit/:id">
                            <EditQuiz />
                        </Route>
                        <Route path="/quiz/:id">
                            <QuizContainer />
                        </Route>
                        <Route path="/pf">
                            <PlastfixForm regions={["Plastfix Australia", "Plastfix New Zealand", "Plastfix USA"]} states={["7500", "2400"]} />
                        </Route>
                        <Route path="/pf2">
                            <PlastfixForm2 />
                        </Route>
                        <Route path="/topics/edit/:id">
                            <EditTopic />
                        </Route>
                        <Route exact path="/course/:course_id">
                            <CourseContainer />
                        </Route>

                        <Route exact path="/test_quizzes">
                            <TopicsTest />
                        </Route>

                        <Route path="/user/:username">
                            <Profile></Profile>
                        </Route>
                        <Route exact path="/courses/edit/:id">
                            <EditCourse></EditCourse>
                        </Route>
                        <Route exact path="/courses/created">
                            <CreatedCourses />
                        </Route>
                        <Route exact path="/courses/teaching">
                            <TeachingCourses />
                        </Route>
                        <Route exact path="/courses/enrolled">
                            <EnrolledCourses />
                        </Route>
                        <Route exact path="/courses/browse">
                            <BrowseCourses />
                        </Route>
                        <Route path="/courses/create">
                            <CreateCourse />
                        </Route>
                        <Route path="/lectures/edit/:id">
                            <EditLecture></EditLecture>
                        </Route>
                        <Route path="/teachers">
                            {user?.currentUserData?.types?.includes("SuperAdmin") ? <Teachers /> : <Redirect to="/" />}
                        </Route>
                        <Route path="/search_users">
                            <SearchUsers></SearchUsers>
                        </Route>
                        <Route path="/courses_tracking">
                            {user?.currentUserData?.types?.includes("SuperAdmin") ? <CoursesTracking /> : <Redirect to="/" />}
                        </Route>
                        <Route exact path="/">
                            {() => check_session()}
                            {user?.currentUser === null ? <Landing /> : <Redirect to="/home" />}
                        </Route>
                    </>)}

                </Switch>
            </Router>
        </div>
    )
}

export default App