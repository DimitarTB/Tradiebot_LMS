import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { AiFillPlayCircle } from 'react-icons/ai'
import { createLecture } from '../../../redux/Lectures/LecturesActions'

const VideoBrowser = props => {

    console.log(props.lectures)
    // const lectures = props.lectures.map((lecture, index, arr) => {
    //     return (
    //         <Fragment>
    //             <button id={(lecture?.watchedBy?.includes(props.user_id)) ? "watched" : null} onClick={e => {
    //                 console.log(e, lecture)
    //                 props.setSelectedLecture(lecture)
    //             }}>{lecture.name} <AiFillPlayCircle /></button>
    //             {/* {index === arr.length - 1 ? (props.currentCourse?.teachers.includes(currentUser.currentUserData._id) ? <div><h1>Teacher si</h1><form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}><input name="name" placeholder="Lecture Name"></input><button>Add</button></form></div> : "") : ""} */}
    //         </Fragment>
    //     )
    // })
    useEffect(() => {
        const lect_id = props.topics[0].lectures[0]
        const lect = props.lectures.find(lec => lec._id === lect_id)
        props.setSelectedLecture(lect)
    }, [])
    const topicCompleted = (lectures) => {
        let watched = true
        lectures.map(lect => {
            const cLect = props.lectures.find(lectt => lectt._id === lect)
            if (cLect.watchedBy.includes(props.user_id)) watched = true
            else watched = false
        })
        return watched
    }
    let display = []
    let first = true
    props.topics.map((topic, tidx) => {
        first = true
        props.lectures.map((lecture, idx) => {
            {
                if (topic.lectures.includes(lecture._id)) {
                    console.log("najde", idx)
                    console.log(lecture)
                    console.log(topic.name)
                    display.push((<Fragment>
                        {first === true ? <h1>{topic.name}</h1> : ""}
                        <button id={(lecture?.watchedBy?.includes(props.user_id)) ? "watched" : null} onClick={e => {
                            console.log(idx, props.topics)
                            if (tidx !== 0) {
                                if (topicCompleted(props.topics[tidx - 1]?.lectures)) props.setSelectedLecture(lecture)
                                else alert("You haven't completed the previous topic!")
                            }
                            else props.setSelectedLecture(lecture)
                        }}>{lecture.name} <AiFillPlayCircle /></button>
                    </Fragment>))
                }
                if (topic.lectures.includes(lecture._id)) first = false
            }
        })
    })
    console.log("topics", display)
    return (
        <div className="video-browser">
            {display}
        </div>
    )
}


export default VideoBrowser
