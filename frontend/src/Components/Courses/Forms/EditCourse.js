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
import { editCourse } from "../../../redux/Courses/CoursesActions"
import VideoBrowser from "../CourseContent/VideoBrowser"
import "./Edit.css"

import { FcCancel } from "react-icons/fc";

export default props => {

    const dispatch = useDispatch()
    const course_id = useParams().id
    console.log("CID", course_id)
    const teachers = useSelector(state => state.user.allUsers.filter(user => user.types.includes("Teacher")))
    const courses = useSelector(state => state.courses)
    const currentCourse = courses.allCourses.find(course => course._id === course_id)
    console.log("CC", currentCourse)
    const currentUser = useSelector(state => state.user)
    const courseLectures = useSelector(state => state.lectures.allLectures.filter(lecture => lecture.course_id === course_id))

    const [info, setInfo] = useState({ type: null, message: null })
    const [course, setCourse] = useState({
        name: currentCourse?.name,
        description: currentCourse?.description,
        teachers: currentCourse?.teachers,
        manualEnroll: currentCourse?.manualEnroll === true ? "Manual Enroll" : "Self Enroll",
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

    const handleSubmit = e => {
        e.preventDefault();

        const data = {
            "token": currentUser.currentUser,
            "name": lectureName.name,
            "course_id": course_id
        }
        dispatch(createLecture(data))

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
        dispatch(getAllLectures(currentUser.currentUser))
        if (info.type === "loading") {
            course.dateCreated = currentCourse.dateCreated
            course._id = course_id
            course.manualEnroll = course.manualEnroll === "Self Enroll" ? false : true
            const data = {
                course: course,
                token: currentUser.currentUser
            }
            dispatch(editCourse(data))
        }
    }, [info.type])

    return (currentCourse?.teachers?.includes(currentUser.currentUserData?._id) || currentUser.currentUserData?.roles.includes("SuperAdmin")) ? (
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
                if (validator(course, courseValidator) !== true) return
                if (courses.updateStatus === "fulfilled") setInfo({ type: "success", message: "Course updated successfully!" })
                else if (courses.updateStatus === "rejected") setInfo({ type: "error", message: courses.updateError })
                else setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }}
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
            ]}
        />
            <div class="lectures">{courseLectures.map(lecture => <Fragment><NavLink class="item" to={"/lectures/edit/" + lecture._id}><h2>{lecture.name}</h2></NavLink><div class="icon"><FcCancel onClick={() => dispatch(deleteLecture({ token: currentUser.currentUser, id: lecture._id }))} /></div></Fragment>)}
                {<div>Add lecture<form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}><input name="name" placeholder="Lecture Name"></input><button>Add</button></form></div>}</div>
        </Fragment>
    ) : <Redirect to="/" />
}