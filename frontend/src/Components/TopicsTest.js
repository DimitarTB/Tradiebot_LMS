import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { addTopic, addTopicLectures, changeTopicName, deleteTopic, getAllTopics } from '../redux/Topics/TopicsActions'

function TopicsTest() {
    const dispatch = useDispatch()
    const topics = useSelector(state => state.topics)
    useEffect(() => {
        console.log("useef")
        dispatch(getAllTopics())
        dispatch(deleteTopic({ "id": "603f75d1b3bce5bc915ff5b7" }))
    }, [])
    return (
        <div>
            <h1>Test</h1>
            {topics.allTopics.map(topic => <h1>{topic.name}</h1>)}
        </div>
    )
}

export default TopicsTest
