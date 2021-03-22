import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from '../Global/Container'
import "../Courses/CourseCard.css"
import { Fragment } from 'react'
import { FILES_URL } from '../../redux/constants'
import { NavLink } from 'react-router-dom'
import { addTeacher, fetchAll, removeTeacher } from '../../redux/Users/UserActions'

function Teachers() {
    const teachers = useSelector(state => state.user.allUsers.filter(usr => usr.types.includes("Teacher")))
    const dispatch = useDispatch()
    console.log(teachers)

    useEffect(() => {
        dispatch(fetchAll())
    }, [])
    return (
        <Container
            details="Teachers"
            description="Assign and remove teachers."
            component={(
                <Fragment>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        dispatch(addTeacher({ "username": e.target.username.value }))
                    }}>
                        <label for="teach">Username</label>
                        <input name="username"></input>
                        <button>Add teacher</button>
                    </form>
                    {teachers.map(tc =>
                        <div className="course-card">
                            <NavLink to={"/user/" + tc._id}>
                                <img src={FILES_URL + tc.profile_picture} />
                                <h3>{tc.username}</h3>
                            </NavLink><hr />
                            <p>{tc.email}</p>
                            <p>{"Registered on: " + tc.dateJoined}</p>
                            <button id="enroll" onClick={e => {
                                const data = {
                                    "user_id": tc._id,
                                }
                                dispatch(removeTeacher(data))
                                alert("Teacher removed!")
                            }
                            }>Remove</button>
                        </div>
                    )}
                </Fragment>
            )}
        />
    )
}

export default Teachers
