import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { AiFillPlayCircle } from 'react-icons/ai'
import { createLecture } from '../../../redux/Lectures/LecturesActions'
import { NavLink, Redirect } from 'react-router-dom'

const VideoBrowser = props => {

    const records = useSelector(state => state.quizzes.quizRecords.filter(rec => rec.user === props.user_id))
    const assignments = useSelector(state => state.assignments.allAssignments.filter(asn => asn.course_id === props.course_id))
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
    const checkValue = (lectures, id) => {
        for (var i = 0; i < lectures.length; i = i + 1) {
            if (lectures[i].id === id) return true;
        }
        return false;
    }
    useEffect(() => {
        const firstLec = props.lectures.find(lect => lect._id === props.topics[0].lectures[0].id)
        props.setSelectedLecture(firstLec)
    }, [])
    const topicCompleted = (lectures) => {
        let watched = true
        lectures.map(lect => {
            const cLect = props.lectures.find(lectt => lectt._id === lect.id)
            if (cLect?.watchedBy?.includes(props.user_id)) watched = true
            else watched = false
        })
        return watched
    }
    const quizCompleted = (topic_id) => {
        const quiz_id = props.quizzes.find(qz => qz.topic_id === topic_id)
        if (records.findIndex(rec => rec.quiz_id === quiz_id._id) === -1) return false
        return true
    }
    const hasQuizzes = (topic_id) => {
        if (props.quizzes.findIndex(qz => qz.topic_id === topic_id) === -1) return false
        return true
    }
    let display = []
    let first = true
    // props.topics.map((topic, tidx) => {
    //     first = true
    //     var counter = 0
    //     props.lectures.map((lecture, idx, arr) => {
    //         {
    //             if (checkValue(topic.lectures, lecture._id)) {
    //                 display.push((<Fragment>

    //                 </Fragment>))
    //                 first = false
    //             }
    //             if (checkValue(topic.lectures, lecture._id)) first = false
    //         }
    //     })
    // })
    props.topics.map((topic, tidx, sz) => {
        var lectureCount = 0
        assignments.map(asn => asn.topic_id === sz[tidx - 1]?._id ? display.push(<NavLink id="navbutton" to={"/assignment/" + asn._id}><button>{"Assignment: " + asn.title}</button></NavLink>) : null)
        props.quizzes.map(qz => qz.topic_id === sz[tidx - 1]?._id ? display.push(<NavLink id="navbutton" to={"/quiz/" + qz._id}><button>{"Quiz: " + qz.name}</button></NavLink>) : null)
        display.push(<button style={{ cursor: "default" }}><h2>{topic.name}</h2></button>)
        props.lectures.map((lecture, idx, arr) => {
            if (checkValue(topic.lectures, lecture._id)) {
                display.push(
                    <Fragment>
                        <button id={(lecture?.watchedBy?.includes(props.user_id)) ? "watched" : null} onClick={e => {
                            if (tidx !== 0) {
                                // if (topicCompleted(props.topics[tidx - 1]?.lectures)) props.setSelectedLecture(lecture)
                                if (hasQuizzes(props.topics[tidx - 1]?._id)) {
                                    if (quizCompleted(props.topics[tidx - 1]?._id) && topicCompleted(props.topics[tidx - 1]?.lectures)) props.setSelectedLecture(lecture)
                                    else alert("You haven't completed the quiz or all of the lectures from the previous topic!")
                                }
                                else props.setSelectedLecture(lecture)
                            }
                            else {
                                props.setSelectedLecture(lecture)
                            }
                        }}>{lecture.name} <AiFillPlayCircle /></button>
                    </Fragment>
                )
                lectureCount++
            }
        })
        if (tidx === sz.length - 1) {
            assignments.map(asn => asn.topic_id === topic._id ? display.push(<NavLink id="navbutton" to={"/assignment/" + asn._id}><button>{"Assignment: " + asn.title}</button></NavLink>) : null)
            props.quizzes.map(qz => qz.topic_id === topic._id ? display.push(<NavLink id="navbutton" to={"/quiz/" + qz._id}><button id={records.find(rc => {
                return (rc.quiz_id === qz._id)
            }) ? "watched" : null}>{"Quiz: " + qz.name}</button></NavLink>) : null)
        }
    })
    return (
        <div className="video-browser">
            {display}
        </div>
    )
}


export default VideoBrowser
