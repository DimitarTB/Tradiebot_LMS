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
import { addTopicLectures, changeTopicName, getAllTopics } from "../../../redux/Topics/TopicsActions"

export default props => {

    const dispatch = useDispatch()
    const topic_id = useParams().id

    const topicSelector = useSelector(state => state.topics)
    const topic = topicSelector.allTopics.find(tp => tp._id === topic_id)
    const course = useSelector(state => state.courses?.allCourses.find(cr => cr._id === topic?.course_id))
    const lectures = useSelector(state => state.lectures?.allLectures.filter(lect => lect?.course_id === course?._id))
    const courseLectures = []


    lectures.forEach(lect => Object.values(topic.lectures).findIndex(tp => tp.id === lect._id) > -1 ? courseLectures.push(lect._id) : "")
    // lectures.forEach(lect => {
    //     console.log(lect._id)
    //     console.log(Object.values(topic.lectures)["_id"] === lect._id)
    // })
    courseLectures.sort((a, b) => a.index > b.index)

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

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    const validator = (data, tester) => {
        // for (const field in data) {
        //     if (typeof data[field] !== tester[field]?.type) return setInfo({ type: "warning", message: "Please enter a valid value for the " + field + " field" })
        //     if (data[field] === null && tester[field].isNullable === false) return setInfo({ type: "warning", message: "Field " + field + " is can't be null" })
        //     if (data[field].length < tester[field].minLength) return setInfo({ type: "warning", message: "Field " + field + " must be longer" })
        //     if (data[field].length > tester[field].maxLength) return setInfo({ type: "warning", message: "Field " + field + " must be shorter" })
        // }
        if(data["name"] === null || data["name"] === undefined || data["name"].length < 1) return setInfo({ type: "warning", message: "Please enter a valid value for the Course Name field" })
        return true
    }

    useEffect(() => {
        if (ff === true) {
            if(topicSelector.editTopicStatus === "fulfilled") {
                setInfo({ type: "success", message: "Topic updated successfully!!" })
                setFulfilled(false)
            }
            else if(topicSelector.editTopicStatus === "pending") {
                setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }
        }
    }, [topicSelector.editTopicStatus])
    return (
        <Fragment><Form
            name="Edit Topic"
            info={info}
            buttonText="Proceed"
            data={cTopic}
            handleChange={e => {
                setTopic({
                    ...cTopic,
                    [e.target.name]: e.target.value
                })
            }}
            handleSubmit={e => {
                e.preventDefault()
                if (validator(cTopic, courseValidator) !== true) return
                if (cTopic.name !== topic.name) dispatch(changeTopicName({ "id": topic._id, "name": cTopic.name }))
                if (cTopic.lectures !== courseLectures) {
                    dispatch(addTopicLectures({ "id": topic._id, "lectures": cTopic.lectures }))
                    setFulfilled(true)
                }
            }
            }
            fields={[
                {
                    name: "name",
                    label: "Topic Name",
                    placeholder: "Please Enter a Name for the topic",
                    type: "text",
                    fieldType: input
                }
            ]}
        />
        </Fragment>
    )
}