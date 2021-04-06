import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useParams } from "react-router-dom"
import { API_URL } from '../../redux/constants'
import { activateUser } from '../../redux/Users/UserActions'

function Activate() {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const token = useParams().token
    const userSelector = useParams().user

    const [ff, setFulfilled] = useState(false)
    const [redirect, setRedirect] = useState(false)
    useEffect(() => {
        dispatch(activateUser({ "token": token, "user": user }))
        setFulfilled(true)
    }, [])

    useEffect(() => {
        if (ff === true && userSelector.activateStatus === "fulfilled") {
            alert(userSelector.activateMessage)
        }
    }, [userSelector.activateStatus])
    return redirect === true ? <Redirect to="/home" /> : null
}

export default Activate
