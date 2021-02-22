import { current } from "@reduxjs/toolkit"
import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, NavLink } from "react-router-dom"
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
import { getOneLecture, updateLecture, uploadFile } from "../../../redux/Lectures/LecturesActions"
import "./Edit.css"
import { FcCancel } from "react-icons/fc";


export default props => {
    const dispatch = useDispatch()

    const lecture_id = useParams().id

    const currentLecture = useSelector(state => state.lectures.allLectures.find(lecture => lecture._id === lecture_id))

    const [info, setInfo] = useState({ type: null, message: null })
    const [lecture, setLecture] = useState({
        name: currentLecture?.name,
        files: [],
        video_file: currentLecture?.video_file
    })

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
        videoFile: {
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

    return (
        <div style={{ "width": "100%" }}>
            <Form
                name="Edit Lecture"
                info={info}
                buttonText="Proceed"
                data={lecture}
                handleChange={e => {
                    setInfo({ type: null, message: null })
                    setLecture({
                        ...lecture,
                        [e.target.name]: e.target.value
                    })
                }}
                handleSubmit={e => {
                    e.preventDefault()
                    // if (validator(lecture, lectureValidator) !== true) return
                    setInfo({ type: "loading", message: "Request is being processed. Please wait." })
                    const data = {
                        name: lecture.name,
                        files: currentLecture.files ? currentLecture.files : [],
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
            <div class="lectures">{currentLecture?.files?.map(fl => <Fragment><h2>{getFileName(fl)}</h2><div class="icon"><FcCancel /></div></Fragment>)}</div>
        </div>
    )
}