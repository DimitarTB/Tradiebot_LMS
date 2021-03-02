import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { API_URL } from "../../redux/constants"
import { getOneUser } from '../../redux/Users/UserActions'

export default function NotActivated(props) {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getOneUser(props.user))
    }, [])
    return props.activated === false ? (
        <div>
            <h1>Your account is not activated! <a href={API_URL + "api/resend?user=" + props.user} target="_blank">Resend</a></h1>
        </div>
    ) : <Redirect to="/" />
}
