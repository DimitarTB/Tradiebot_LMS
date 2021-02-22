import React from 'react'
import { API_URL } from "../../redux/constants"

export default function NotActivated(props) {
    return (
        <div>
            <h1>Your account is not activated! <a href={API_URL + "api/resend?user=" + props.user} target="_blank">Resend</a></h1>
        </div>
    )
}
