import React, { Fragment, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { AiFillPlayCircle } from 'react-icons/ai'
import { createLecture } from '../../../redux/Lectures/LecturesActions'

const VideoBrowser = props => {

    const currentUser = useSelector(state => state.user)
    const allLectures = useSelector(state => state.lectures)
    const dispatch = useDispatch()
    const [lectureName, setLectureName] = useState({
        "name": ""
    })

    

    console.log(props.lectures)
    const lectures = props.lectures.map((lecture, index, arr) => {
        return (
            <Fragment>
                <button id={(lecture?.watchedBy?.includes(props.user_id)) ? "watched" : null} onClick={e => {
                    console.log(e, lecture)
                    props.setSelectedLecture(lecture)
                }}>{lecture.name} <AiFillPlayCircle /></button>
                {/* {index === arr.length - 1 ? (props.currentCourse?.teachers.includes(currentUser.currentUserData._id) ? <div><h1>Teacher si</h1><form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}><input name="name" placeholder="Lecture Name"></input><button>Add</button></form></div> : "") : ""} */}
            </Fragment>
        )
    })
    return (
        <div className="video-browser">
            {lectures}
        </div>
    )
}


export default VideoBrowser
