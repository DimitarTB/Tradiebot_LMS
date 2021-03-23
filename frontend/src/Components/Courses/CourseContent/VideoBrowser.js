import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { AiFillPlayCircle } from 'react-icons/ai'
import { createLecture } from '../../../redux/Lectures/LecturesActions'
import { NavLink, Redirect } from 'react-router-dom'

const VideoBrowser = props => {

    const records = useSelector(state => state.quizzes.quizRecords.filter(rec => rec.user === props.user_id))
    console.log(props.quizzes)
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
        props.setSelectedLecture(props.topics[0]?.lectures[0]?.id)
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
        console.log(topic_id)
        console.log(props.quizzes)
        const quiz_id = props.quizzes.find(qz => qz.topic_id === topic_id)
        console.log(quiz_id)
        console.log(records)
        if (records.findIndex(rec => rec.quiz_id === quiz_id._id) === -1) return false
        return true
    }
    const hasQuizzes = (topic_id) => {
        console.log(topic_id)
        console.log(props.quizzes)
        if (props.quizzes.findIndex(qz => qz.topic_id === topic_id) === -1) return false
        return true
    }
    let display = []
    let first = true
    props.topics.map((topic, tidx) => {
        first = true
        props.lectures.map((lecture, idx, arr) => {
            {
                if (checkValue(topic.lectures, lecture._id)) {
                    console.log("DISPLAY " + topic)
                    display.push((<Fragment>
                        {first === true ? <h1>{topic.name}</h1> : <Fragment></Fragment>}
                        <button id={(lecture?.watchedBy?.includes(props.user_id)) ? "watched" : null} onClick={e => {
                            if (tidx !== 0) {
                                // if (topicCompleted(props.topics[tidx - 1]?.lectures)) props.setSelectedLecture(lecture)
                                console.log("Ne e 0")
                                if (hasQuizzes(props.topics[tidx - 1]?._id)) {
                                    console.log("ima kviz")
                                    if (quizCompleted(props.topics[tidx - 1]?._id)) props.setSelectedLecture(lecture)
                                    else alert("You haven't completed the quiz of the previous topic!")
                                }
                                else props.setSelectedLecture(lecture)
                            }
                            else {
                                props.setSelectedLecture(lecture)
                            }
                        }}>{lecture.name} <AiFillPlayCircle /></button>

                        {idx === arr.length - 1 ? props.quizzes.map(qz => {
                            console.log("USLOV", topic)
                            if (qz.topic_id === topic._id) display.push(<button>{"Quiz: " + qz.name}</button>)
                        }) : null}
                    </Fragment>))
                    first = false
                }
                if (checkValue(topic.lectures, lecture._id)) first = false
            }
        })
    })
    return (
        <div className="video-browser">
            {display}
        </div>
    )
}


export default VideoBrowser
