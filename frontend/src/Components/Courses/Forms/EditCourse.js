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

import { FcCancel } from "react-icons/fc";
import { getAllTopics } from "../../../redux/Topics/TopicsActions"

export default props => {

    const dispatch = useDispatch()
    const course_id = useParams().id
    console.log("CID", course_id)
    const teachers = useSelector(state => state.user.allUsers.filter(user => user.types.includes("Teacher")))
    const courses = useSelector(state => state.courses)
    const currentCourse = courses?.allCourses.find(course => course?._id === course_id)
    console.log("CC", currentCourse)
    const currentUser = useSelector(state => state.user)
    const courseLectures = useSelector(state => state.lectures.allLectures.filter(lecture => lecture.course_id === course_id))
    const topics = useSelector(state => state.topics?.allTopics.filter(topic => topic?.course_id === course_id))

    const [info, setInfo] = useState({ type: null, message: null })
    const [course, setCourse] = useState({
        name: currentCourse?.name,
        description: currentCourse?.description,
        teachers: currentCourse?.teachers,
        manualEnroll: currentCourse?.manualEnroll === true ? "Manual Enroll" : "Self Enroll",
        thumbnail: null
    })
    const [ff, setFulfilled] = useState(false)
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
        e.preventDefault();
        const data = {
            "token": currentUser.currentUser,
            "name": lectureName.name,
            "course_id": course_id,
            "topic_id": topic._id
        }
        dispatch(createLecture(data))
    }

    const topicLectures = (lectr, lectures) => {
        const fnd = lectures.filter(lect => lect._id === String(lectr))
        console.log(fnd)
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
        console.log(topics)
        console.log(courseLectures)
    }, [])
    useEffect(() => {
        if (ff === true) {
            if (course.thumbnail !== null) {
                if (courses.thumbnailStatus === "fulfilled") setInfo({ type: "success", message: "Lecture updated successfully!!" })
                else if (courses.thumbnailStatus === "rejected") setInfo({ type: "error", message: courses.updateError })
                else setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }
            else {
                if (courses.updateStatus === "fulfilled") setInfo({ type: "success", message: "Lecture updated successfully!!" })
                else if (courses.updateStatus === "rejected") setInfo({ type: "error", message: courses.updateError })
                else setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }
        }
    }, [courses.thumbnailStatus, courses.updateStatus])

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
                    token: currentUser.currentUser
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
        />
            <div class="lectures">{topics.map(topic =>
                topic.lectures.map((lect, idx) => {
                    const lecture = topicLectures(lect, courseLectures)[0]
                    return (<Fragment>{idx === 0 ? <div><h1>{topic.name}</h1>{<div>Add lecture<form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e, topic)}><input name="name" placeholder="Lecture Name"></input><button>Add</button></form></div>}</div> : ""}<NavLink class="item" to={"/lectures/edit/" + lecture?._id}><h2>{lecture?.name}</h2></NavLink><div class="icon"><FcCancel onClick={() => dispatch(deleteLecture({ token: currentUser?.currentUser, id: lecture?._id, topic_id: topic._id }))} /></div></Fragment>)
                })


            )}
            </div>
        </Fragment>
    ) : <Redirect to="/" />
}