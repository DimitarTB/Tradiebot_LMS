import { current } from "@reduxjs/toolkit"
import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, NavLink, Redirect } from "react-router-dom"

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
    const topic_id = useParams().id

    const topic = useSelector(state => state.topics.allTopics.find(tp => tp._id === topic_id))
    const course = useSelector(state => state.courses?.allCourses.find(cr => cr._id === topic?.course_id))
    const lectures = useSelector(state => state.lectures?.allLectures.filter(lect => lect?.course_id === course?._id))
    const courseLectures = []

    lectures.forEach(lect => courseLectures.push(lect.name))
    console.log(courseLectures)

    const [info, setInfo] = useState({ type: null, message: null })
    const [cTopic, setTopic] = useState({
        name: topic?.name,
        lectures: courseLectures
    })
    const [ff, setFulfilled] = useState(false)
    const courseValidator = {
        name: {
            type: "string",
            isNullable: false,
            minLength: 3,
            maxLength: 64,
        },
        lectures: {
            type: "object",
            isNullable: true,
            minLength: 0,
            maxLength: 50
        }
    }

    const handleChange = e => {

    }

    const handleSubmit = (e, topic) => {
        e.preventDefault();

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
        console.log(topic_id)
        console.log(cTopic)
    }, [])
    useEffect(() => {
        if (ff === true) {

        }
        else {

        }
    }, [])

    return (
        <Fragment><Form
            name="Edit Topic"
            info={info}
            buttonText="Proceed"
            data={cTopic}
            handleChange={e => {

            }}
            handleSubmit={e => {
                e.preventDefault()
                // if (validator(course, courseValidator) !== true) return

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
                    name: "lectures",
                    label: "Select Lectures",
                    placeholder: "Please Select Lectures for this topic",
                    fieldType: multipleSelect,
                    options: cTopic.lectures,
                    displayField: "username",
                    valueField: "_id"
                }
            ]}
        />
        </Fragment>
    )
}