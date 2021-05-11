import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { AiFillPlayCircle } from 'react-icons/ai'
import { createLecture } from '../../../redux/Lectures/LecturesActions'
import { NavLink, Redirect } from 'react-router-dom'

const VideoBrowser = props => {
    const records = useSelector(state => state.quizzes.quizRecords.filter(rec => rec.user === props.user_id))
    const assignments = useSelector(state => state.assignments.allAssignments.filter(asn => asn.course_id === props.course_id))
    console.log("ovde")
    function compare(a, b) {
        if (a.index > b.index) {
            return 1;
        }
        if (a.index < b.index) {
            return -1;
        }
        return 0;
    }

    function scrollLeft(idx) {
        if (document.getElementById("scroller")) document.getElementById("scroller").scrollLeft = (idx * 100)
    }
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
    props.topics.map(tp => tp.lectures.sort(compare))
    const showLectures = [...props.lectures]
    showLectures.sort(compare)

    const checkValue = (lectures, id) => {
        for (var i = 0; i < lectures.length; i = i + 1) {
            if (lectures[i].id === id) return true;
        }
        return false;
    }
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
    
    props.topics.map((topic, tidx, sz) => {
        var lectureCount = 0
        assignments.map(asn => asn.topic_id === sz[tidx - 1]?._id ? display.push(<button><NavLink id="navbutton" to={"/assignment/" + asn._id}>{"Assignment: " + asn.title}</NavLink></button>) : null)
        props.quizzes.map(qz => qz.topic_id === sz[tidx - 1]?._id ? display.push(<button><NavLink id="navbutton" to={"/quiz/" + qz._id}>{"Quiz: " + qz.name}</NavLink></button>) : null)
        display.push(<button id="topic_nav" style={{ cursor: "default" }}><h2>{"Topic: " + topic.name}</h2></button>)
        topic.lectures.map((lc, idxx) => {
            const lecture = props.lectures.find(lec => lec._id === lc.id)
            if (lecture) {
                display.push(
                    <Fragment>
                        {/* {props.selected?._id === lecture?._id ? scrollLeft(lc.index) : null} */}
                        <button className={props.selected?._id === lecture?._id ? "selected" : ""} id={(lecture?.watchedBy?.includes(props.user_id)) ? "watched" : null} onClick={e => {
                            if (tidx !== 0) {
                                // if (topicCompleted(props.topics[tidx - 1]?.lectures)) props.setSelectedLecture(lecture)
                                if (hasQuizzes(props.topics[tidx - 1]?._id)) {
                                    // if (quizCompleted(props.topics[tidx - 1]?._id) && topicCompleted(props.topics[tidx - 1]?.lectures)) props.setSelectedLecture(lecture)
                                    // else alert("You haven't completed the quiz or all of the lectures from the previous topic!")
                                }
                                // else props.setSelectedLecture(lecture)
                            }
                            else {
                                // props.setSelectedLecture(lecture)
                            }
                        }}>{lecture.name} <AiFillPlayCircle /></button>
                    </Fragment>
                )
                lectureCount++
            }
        })
        if (tidx === sz.length - 1) {
            assignments.map(asn => asn.topic_id === topic._id ? display.push(<button><NavLink id="navbutton" to={"/assignment/" + asn._id}>{"Assignment: " + asn.title}</NavLink></button>) : null)
            props.quizzes.map(qz => qz.topic_id === topic._id ? display.push(<button id={records.find(rc => {
                return (rc.quiz_id === qz._id)
            }) ? "watched" : null}><NavLink id="navbutton" to={"/quiz/" + qz._id}>{"Quiz: " + qz.name}</NavLink></button>) : null)
        }
    })
    return (
        <Fragment>
            <div className="video-browser">
                {display}
            </div>
            <div className="video-mobile" id="scroller">
                {display}
            </div>
        </Fragment>
    )
}


export default VideoBrowser
