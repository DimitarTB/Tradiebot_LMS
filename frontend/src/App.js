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
    Redirect,
    useParams
} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import EnrolledCourses from './Components/Courses/EnrolledCourses'
import CourseContainer from "./Components/Courses/CourseContent/CourseContainer"
import NotActivated from './Components/User/NotActivated'
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
import QuizTracking from './Components/Quiz/QuizTracking'
import Home from './Components/Landing/Home'
import Activate from './Components/User/Activate'
import Certificates from './Components/User/Certificates'
import Certificate from './Components/Courses/CourseContent/Certificate'
import RequestCertificate from './Components/User/RequestCertificate'
import ValidCertificate from './Components/User/ValidCertificate'
import PdfComponent from './Components/Courses/PdfComponent'
import PrintFile from './Components/Courses/PrintFile'

function App() {

    const user = useSelector(state => state.user)
    const [redirect, setRedirect] = useState(false)

    const dispatch = useDispatch()

    const check_session = () => {
        if (user.currentUserData !== null) {
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
                        <Route exact path="/home">
                            {() => check_session()}
                            <Home />
                        </Route>
                        <Route path="/quizzes/edit/:id">
                            <EditQuiz />
                        </Route>
                        <Route path="/quiz/:id">
                            <QuizContainer />
                        </Route>
                        <Route path="/activate/:token/:user">
                            <Activate />
                        </Route>
                        <Route exact path="/print">
                            <PrintFile />
                        </Route>
                        {/* <Route path="/pf">
                            <PlastfixForm regions={["Plastfix Australia", "Plastfix New Zealand", "Plastfix USA"]} states={["7500", "2400"]} />
                        </Route>
                        <Route path="/pf2">
                            <PlastfixForm2 />
                        </Route> */}
                        <Route path="/topics/edit/:id">
                            <EditTopic />
                        </Route>
                        <Route exact path="/course/:course_id">
                            <CourseContainer />
                        </Route>
                        <Route exact path="/pdf">
                            <PdfComponent />
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
                            {user?.currentUserData?.types?.includes("SuperAdmin") ? <CreateCourse /> : <Redirect to="/" />}
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
                        <Route path="/certificate">
                            <Certificate />
                        </Route>
                        <Route path="/quizzes_tracking">
                            {user?.currentUserData?.types?.includes("SuperAdmin") ? <QuizTracking /> : <Redirect to="/" />}
                        </Route>
                        <Route path="/my_certificates">
                            <Certificates />
                        </Route>
                        <Route path="/request_certificate/:course_id">
                            <RequestCertificate />
                        </Route>
                        <Route path="/valid_certificate/:course_id/:user_id">
                            <ValidCertificate />
                        </Route>
                        <Route exact path="/">
                            {() => check_session()}
                            {user?.currentUser === null ? <Landing /> : <Redirect to="/home" />}
                        </Route>
                    </>)}

                </Switch>
            </Router>
        </div >
    )
}

export default App