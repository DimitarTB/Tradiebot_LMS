import { current } from "@reduxjs/toolkit"
import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, NavLink, Redirect } from "react-router-dom"
import { createLecture, deleteLecture, getAllLectures } from "../../../redux/Lectures/LecturesActions"

import Form, {
    datePicker,
    file,
    input,
    multipleSelect,
    select
} from '../../../react-former/Form'
import { editCourse, getOneCourse, uploadThumbnail } from "../../../redux/Courses/CoursesActions"
import VideoBrowser from "../CourseContent/VideoBrowser"
import "./Edit.css"

import { TiDelete } from "react-icons/ti";
import { BsFillCaretUpFill, BsFillCaretDownFill } from "react-icons/bs";
import { addTopic, deleteTopic, getAllTopics, lectureDown, lectureUp, topicDown, topicUp } from "../../../redux/Topics/TopicsActions"
import { createQuiz, getAllQuizzes } from "../../../redux/Quizzes/QuizzesActions"

export default props => {
    const dispatch = useDispatch()
    const course_id = useParams().id
    const teachers = useSelector(state => state.user.allUsers.filter(user => user.types.includes("Teacher")))
    const courses = useSelector(state => state.courses)
    const currentCourse = courses?.allCourses.find(course => course?._id === course_id)
    const currentUser = useSelector(state => state.user)
    const courseLectures = useSelector(state => state.lectures.allLectures.filter(lecture => lecture.course_id === course_id))
    const topics = useSelector(state => state.topics?.allTopics.filter(topic => topic?.course_id === course_id))
    console.log(course_id)
    const quizzes = useSelector(state => state.quizzes?.allQuizzes?.filter(quiz => quiz?.course_id === course_id))
    console.log("QZ", quizzes)

    topics.sort((a, b) => a.index < b.index ? -1 : a.index > b.index ? 1 : 0)

    const [info, setInfo] = useState({ type: null, message: null })
    const [course, setCourse] = useState({
        name: currentCourse?.name,
        description: currentCourse?.description,
        teachers: currentCourse?.teachers,
        manualEnroll: currentCourse?.manualEnroll === true ? "Manual Enroll" : "Self Enroll",
        thumbnail: null
    })
    const [topicName, setTopicName] = useState("")
    const [ff, setFulfilled] = useState(false)
    const [addTopicData, setTopicData] = useState({
        "name": ""
    })
    const courseValidator = {
        name: {
            type: "string",
            isNullable: false,
            minLength: 3,
            maxLength: 64,
        },
        description: {
            type: "string",
            isNullable: false,
            minLength: 6,
            maxLength: 256
        },
        teachers: {
            type: "object",
            isNullable: true,
            minLength: 0,
            maxLength: 4
        },
        manualEnroll: {
            type: "string",
            isNullable: false
        },
        files: {
            type: "object",
            isNullable: true,
            minLength: 0,
            maxLength: 10
        }
    }


    const [lectureName, setLectureName] = useState({
        name: ""
    })
    const handleChange = e => {
        setLectureName({
            ...lectureName,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e, topic) => {
        const data = {
            "token": currentUser.currentUser,
            "name": lectureName.name,
            "course_id": course_id,
            "topic_id": topic._id
        }
        dispatch(createLecture(data))
        return false;
    }

    const idxDown = (idx, tp) => {
        dispatch(lectureDown({ "topic_id": tp, "index": idx }))
    }

    const idxUp = (idx, tp) => {
        dispatch(lectureUp({ "topic_id": tp, "index": idx }))
    }

    const topicLectures = (lectr, lectures) => {
        const fnd = lectures.filter(lect => lect._id === String(lectr))
        return fnd
    }
    const validator = (data, tester) => {
        for (const field in data) {
            if (typeof data[field] !== tester[field]?.type) return setInfo({ type: "warning", message: "Please enter a valid value for the " + field + " field" })
            if (data[field] === null && tester[field].isNullable === false) return setInfo({ type: "warning", message: "Field " + field + " is can't be null" })
            if (data[field].length < tester[field].minLength) return setInfo({ type: "warning", message: "Field " + field + " must be longer" })
            if (data[field].length > tester[field].maxLength) return setInfo({ type: "warning", message: "Field " + field + " must be shorter" })
        }

        return true
    }

    useEffect(() => {
        dispatch(getOneCourse({ "id": course_id }))
        dispatch(getAllLectures(currentUser.currentUser))
        dispatch(getAllTopics())
        dispatch(getAllQuizzes())
    }, [])
    useEffect(() => {
        if (ff === true) {
            if (course.thumbnail !== null) {
                if (courses.thumbnailStatus === "fulfilled") setInfo({ type: "success", message: "Course updated successfully!!" })
                else if (courses.thumbnailStatus === "rejected") setInfo({ type: "error", message: courses.updateError })
                else setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }
            else {
                if (courses.updateStatus === "fulfilled") setInfo({ type: "success", message: "Course updated successfully!!" })
                else if (courses.updateStatus === "rejected") setInfo({ type: "error", message: courses.updateError })
                else setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }
        }
    }, [courses.thumbnailStatus, courses.updateStatus])

    let display = []
    console.log(quizzes)

    topics.map((topic) => {
        if (topic.lectures.length === 0) {
            display.push
                (
                    <div className="topic">
                        <NavLink to={"/topics/edit/" + topic._id}>
                            <h1 id="topic_name">{"Topic: " + topic.name}</h1>
                        </NavLink>
                        <TiDelete style={{ color: "red" }} onClick={() => dispatch(deleteTopic({ "id": topic._id }))} />
                        <BsFillCaretUpFill onClick={() => dispatch(topicDown({ "course_id": topic.course_id, "index": topic.index }))} /><BsFillCaretDownFill onClick={() => dispatch(topicUp({ "course_id": topic.course_id, "index": topic.index }))} />
                        <button id="add" onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("add " + topic._id).style.visibility === "visible" ? document.getElementById("add " + topic._id).style.visibility = "hidden" : document.getElementById("add " + topic._id).style.visibility = "visible"
                        }}>+ Add lecture</button>
                        <br />
                        <div id={"add " + topic._id} style={{ visibility: "hidden" }}>
                            Add lecture<form onChange={e => handleChange(e)} onSubmit={(e) => {
                                e.preventDefault();
                            }}><input name="name" placeholder="Lecture Name"></input><button onClick={e => {
                                e.preventDefault()
                                handleSubmit(e, topic)
                            }}>Add</button></form>
                        </div>
                        {quizzes?.findIndex(quiz => quiz?.topic_id === topic?._id) === -1 ?
                            <Fragment>
                                <label>Add quiz</label>
                                <form onSubmit={(e) => { e.preventDefault(); dispatch(createQuiz({ "name": e.target.name.value, "topic_id": topic?._id, "course_id": course_id })) }}>
                                    <input name="name"></input>
                                    <button>Add</button>
                                </form>
                            </Fragment> : ""}
                    </div>
                )
        }
        else {
            display.push
                (
                    <div className="topic">
                        {
                            topic.lectures.map((lect, idx, len) => {
                                const lecture = topicLectures(lect.id, courseLectures)[0]
                                return (<Fragment>
                                    {idx === 0 ?
                                        <Fragment>
                                            <NavLink to={"/topics/edit/" + topic._id}><h1 id="topic_name">{"Topic: " + topic.name}</h1></NavLink>
                                            <TiDelete style={{ color: "red" }} onClick={() => dispatch(deleteTopic({ "id": topic._id }))} />
                                            <BsFillCaretUpFill onClick={() => dispatch(topicDown({ "course_id": topic.course_id, "index": topic.index }))} />
                                            <BsFillCaretDownFill onClick={() => dispatch(topicUp({ "course_id": topic.course_id, "index": topic.index }))} />
                                            {

                                                <div>
                                                    <br />
                                                    {quizzes?.findIndex(quiz => quiz?.topic_id === topic?._id) === -1 ?
                                                        <Fragment>
                                                            <label>Add quiz</label><form onSubmit={
                                                                (e) => {
                                                                    e.preventDefault(); dispatch(createQuiz({ "name": e.target.name.value, "topic_id": topic?._id, "course_id": course_id }))
                                                                }}>
                                                                <input name="name"></input>
                                                                <button>Add</button>
                                                            </form>
                                                        </Fragment>
                                                        : ""}
                                                </div>
                                            }</Fragment> : ""}
                                    <div className="border">
                                        <NavLink class="item" to={"/lectures/edit/" + lecture?._id}><h2>{lecture?.name}</h2></NavLink>
                                        <div class="icon">
                                            <TiDelete style={{ color: "red" }} onClick={() => dispatch(deleteLecture({ token: currentUser?.currentUser, id: lecture?._id, topic_id: topic._id }))} />
                                            {idx !== 0 || idx === 0 ?
                                                <Fragment>
                                                    <BsFillCaretUpFill onClick={() => idxDown(idx, topic._id)} />
                                                    {idx !== (len - 1) ?
                                                        <BsFillCaretDownFill onClick={() => idxUp(idx, topic._id)} />
                                                        : ""}</Fragment> : idx !== (len - 1) ?
                                                    <BsFillCaretDownFill onClick={() => idxUp(idx, topic._id)} />
                                                    : ""}
                                        </div>
                                    </div>
                                    {idx === (len.length - 1) ?
                                        <Fragment>
                                            <button id="add" onClick={(e) => {
                                                e.preventDefault();
                                                document.getElementById("add " + topic._id).style.visibility === "visible" ? document.getElementById("add " + topic._id).style.visibility = "hidden" : document.getElementById("add " + topic._id).style.visibility = "visible"
                                            }}>+ Add lecture</button>
                                            <br />
                                            <div id={"add " + topic._id} style={{ visibility: "hidden" }}>
                                                Add lecture<form onChange={e => handleChange(e)} onSubmit={(e) => {
                                                    e.preventDefault();
                                                }}><input name="name" placeholder="Lecture Name"></input><button onClick={e => {
                                                    e.preventDefault()
                                                    handleSubmit(e, topic)
                                                }}>Add</button></form>
                                            </div>
                                            <h2>Quiz: <NavLink to={"/quizzes/edit/" + quizzes?.find(quiz => quiz?.topic_id === topic?._id)?._id}>{quizzes?.find(quiz => quiz?.topic_id === topic?._id)?._id}</NavLink>
                                            </h2>
                                        </Fragment> : ""}
                                </Fragment>)
                            })
                        }
                    </div>
                )
        }
    })

    return (currentCourse?.teachers?.includes(currentUser.currentUserData?._id) || currentUser.currentUserData?.types?.includes("SuperAdmin")) ? (
        <Fragment><Form
            name="Edit Course"
            info={info}
            buttonText="Proceed"
            data={course}
            handleChange={e => {
                setInfo({ type: null, message: null })
                setCourse({
                    ...course,
                    [e.target.name]: e.target.value
                })
            }}
            handleSubmit={e => {
                e.preventDefault()
                // if (validator(course, courseValidator) !== true) return
                course.dateCreated = currentCourse.dateCreated
                course._id = course_id
                course.manualEnroll = course.manualEnroll === "Self Enroll" ? false : true
                let data = {
                    course: course,
                    token: currentUser.currentUser,
                    thumbnail: course.thumbnail === null ? currentCourse.thumbnail : course.thumbnail
                }
                dispatch(editCourse(data))
                if (course.thumbnail !== null) {
                    const data = {
                        id: course_id,
                        file: course.thumbnail
                    }
                    dispatch(uploadThumbnail(data))
                }
                setFulfilled(true)
            }
            }
            fields={[
                {
                    name: "name",
                    label: "Course Name",
                    placeholder: "Please Enter Course Name",
                    type: "text",
                    fieldType: input
                },
                {
                    name: "description",
                    label: "Course Description",
                    placeholder: "Please Enter Course Description",
                    type: "textarea",
                    fieldType: input
                },
                {
                    name: "teachers",
                    label: "Select Teachers",
                    placeholder: "Please Select Teachers for this course",
                    fieldType: multipleSelect,
                    options: teachers,
                    displayField: "username",
                    valueField: "_id"
                },
                {
                    name: "manualEnroll",
                    label: "Select Course Type",
                    placeholder: "Please Select Teachers for this course",
                    fieldType: select,
                    options: [{ name: "Manual Enroll" }, { name: "Self Enroll" }],
                    displayField: "name",
                    valueField: "name"
                },
                {
                    name: "thumbnail",
                    label: "Select Thumbnail",
                    fieldType: file,
                    multiple: false
                }
            ]}
            overloadedFields={[
                (
                    <div>
                        {display}
                        < br /><br />
                        <div className="topic">Add Topic
                        <form
                                onChange={e => setTopicData({
                                    ...addTopicData,
                                    [e.target.name]: e.target.value
                                })}
                                onSubmit={e => {
                                    e.preventDefault()
                                }}>
                                <input name="name" value={addTopicData.name} placeholder="Lecture Name" />
                                <button type="button" onClick={() => {
                                    dispatch(addTopic({ "name": addTopicData.name, "course_id": currentCourse._id }))
                                }}>Add</button>
                            </form>
                        </div>
                    </div>
                )
            ]}
        />
        </Fragment>
    ) : <Redirect to="/" />
}