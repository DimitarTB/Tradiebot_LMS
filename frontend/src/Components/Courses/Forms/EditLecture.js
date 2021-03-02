import { current } from "@reduxjs/toolkit"
import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, NavLink, Redirect } from "react-router-dom"
import axios from 'axios'
import { API_URL, getFileName } from "../../../redux/constants"

import Form, {
    datePicker,
    file,
    input,
    multipleSelect,
    select
} from '../../../react-former/Form'
import { editCourse } from "../../../redux/Courses/CoursesActions"
import { getOneLecture, updateLecture, uploadFile, deleteFile } from "../../../redux/Lectures/LecturesActions"
import "./Edit.css"
import { FcCancel } from "react-icons/fc";


export default props => {
    const dispatch = useDispatch()

    const lecture_id = useParams().id

    const lectures = useSelector(state => state.lectures)
    const currentLecture = lectures.allLectures.find(lecture => lecture._id === lecture_id)
    const lectureCourse = useSelector(state => state.courses?.allCourses.find(c => c?._id === currentLecture?.course_id))
    const currentUser = useSelector(state => state.user)

    const [info, setInfo] = useState({ type: null, message: null })
    const [lecture, setLecture] = useState({
        name: currentLecture?.name,
        files: [],
        video_file: currentLecture?.video_file
    })
    const [ff, setFulfilled] = useState(false)

    const lectureValidator = {
        name: {
            type: "string",
            isNullable: false,
            minLength: 3,
            maxLength: 64,
        },
        files: {
            type: "object",
            isNullable: true,
            minLength: 0,
            maxLength: 10
        },
        video_file: {
            type: "string",
            isNullable: false
        }
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
        const data = { "id": lecture_id }
        dispatch(getOneLecture(data))
    }, [])
    useEffect(() => {
        if (ff === true) {
            if (lecture.files.length > 0) {
                if (lectures.filesStatus === "fulfilled") setInfo({ type: "success", message: "Lecture updated successfully!!" })
                else if (lectures.filesStatus === "rejected") setInfo({ type: "error", message: lectures.updateError })
                else setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }
            else {
                if (lectures.updateStatus === "fulfilled") setInfo({ type: "success", message: "Lecture updated successfully!!" })
                else if (lectures.updateStatus === "rejected") setInfo({ type: "error", message: lectures.updateError })
                else setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }
        }
    }, [lectures.updateStatus, lectures.filesStatus])
    return (lectureCourse?.teachers?.includes(currentUser?.currentUserData?._id) || currentUser?.currentUserData?.types?.includes("SuperAdmin")) ? (
        <div style={{ "width": "100%" }}>
            <Form
                name="Edit Lecture"
                info={info}
                buttonText="Proceed"
                data={lecture}
                handleChange={e => {
                    setFulfilled(false)
                    setInfo({ type: null, message: null })
                    setLecture({
                        ...lecture,
                        [e.target.name]: e.target.value
                    })
                }}
                handleSubmit={e => {
                    e.preventDefault()
                    if (validator(lecture, lectureValidator) !== true) return
                    const data = {
                        name: lecture.name,
                        files: currentLecture?.files ? currentLecture.files : [],
                        video_file: lecture.video_file,
                        dateCreated: currentLecture.dateCreated,
                        course_id: currentLecture.course_id,
                        id: lecture_id,
                    }
                    if (lecture.files.length > 0) data.file = true
                    console.log("dispatch")
                    dispatch(updateLecture(data))

                    if (lecture.files.length > 0) {
                        const data = {
                            lecture: lecture,
                            lecture_id: lecture_id
                        }
                        dispatch(uploadFile(data))
                    }
                    setFulfilled(true)
                }}
                fields={[
                    {
                        name: "name",
                        label: "Lecture Name",
                        placeholder: "Please Enter Lecture Name",
                        type: "text",
                        fieldType: input
                    },
                    {
                        name: "files",
                        label: "Select Files",
                        fieldType: file,
                        multiple: true
                    },
                    {
                        name: "video_file",
                        label: "Video for the lecture",
                        type: "text",
                        fieldType: input,
                    }
                ]}
            />
            <div class="lectures">{currentLecture?.files?.map(fl => <Fragment><h2>{getFileName(fl)}</h2><div class="icon"><FcCancel onClick={() => dispatch(deleteFile({"id": currentLecture?._id, "file": fl}))} /></div></Fragment>)}</div>
        </div>
    ) : <Redirect to="/" />
}