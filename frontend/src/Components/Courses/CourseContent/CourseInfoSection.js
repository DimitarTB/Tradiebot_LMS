import React, { useState } from 'react'

const CourseInfoSection = props =>{

    const [selectedTab, setSelectedTab ] = useState(0)

    const tabs = [
        (
            <div className="course-details">
                <h2>{props.course?.name}</h2>
                <p>{props.course?.description}</p>
                <p>{props.course?.dateCreated}</p>
            </div>
        ),
        (
            <div className="course-comments">
                Lecture Comments     
            </div>
        ),
        (
            <div className="course-files">
                Lecture Files
                {props.lecture?.files.map(file => <a href={file.file_path} download>{file.name}</a>)}
            </div>
        )
    ]

    return (
        <div className="course-info">
            <div className="info-nav">
                <h3 onClick={e => setSelectedTab(0)}>Details</h3>
                <h3 onClick={e => setSelectedTab(1)}>Comments</h3>
                <h3 onClick={e => setSelectedTab(2)}>Files</h3>
            </div>
            <div className="tab">
                {tabs[selectedTab]}
            </div>
        </div>
    )
}


export default CourseInfoSection