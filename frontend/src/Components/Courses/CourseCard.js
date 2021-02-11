import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import "./CourseCard.css"

export default props => {

    const users = useSelector(state => state.user.allUsers)

    const _users = users.length > 3 ? users.filter(user =>  props.course.teachers.includes(user._id)) : []
    let teachers = ""

    for (const _user of _users){
        if(_user !== _users[0]) teachers += ", " + _user.username
        else teachers += _user.username
    }
    return (
        <NavLink to={"/course/"+props.course._id} className="course-card">
            <img src="https://images.idgesg.net/images/article/2020/01/sale_25561_primary_image_wide-100827989-large.jpg" />
            <h3>{props.course.name}</h3>
            <p>{props.course.description}</p>
            <p>Teachers : {teachers}</p>
        </NavLink>
    )
}