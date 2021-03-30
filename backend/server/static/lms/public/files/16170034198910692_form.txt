import React, { useState } from 'react'
import "./Edit.css"

function PlastfixForm(props) {


    // Object
    const [data, setData] = useState({
        "manager_name": "",
        "region": props?.regions[0],
        "technicians_number": 0,
        "job_title": "",
        "state": props?.states[0],
        "time": "Part Time",
        "description": ""
    })

    // Form handling
    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        console.log(data)
    }


    // HTML
    return (
        <div class="pform">
            <h2>Internal Staff Request Form</h2>
            <form onChange={(e) => handleChange(e)} onSubmit={(e) => handleSubmit(e)}>
                <label for="manager_name">Manager Name</label><br />
                <input name="manager_name"></input><br />

                <label for="region">Region</label><br />
                <select name="region">
                    {props?.regions?.map(reg => <option value={reg}>{reg}</option>)}
                </select><br />

                <label for="technicians_number">Number of Technicians</label><br />
                <input name="technicians_number"></input><br />

                <label for="job_title">Job Title</label><br />
                <input name="job_title"></input><br />

                <label for="state">State</label><br />
                <select name="state">
                    {props?.states?.map(state => <option value={state}>{state}</option>)}
                </select><br />

                <label for="time">Part/Full Time</label><br />
                <select name="time">
                    <option value="Part Time">Part Time</option>
                    <option value="Full Time">Full Time</option>
                </select><br />

                <label for="description">Description</label><br />
                <textarea name="description"></textarea><br />
                <h6>Plastfix HR support team will review and respond to your request</h6><button type="submit">Send Staff Request</button>
            </form>
        </div>
    )
}

export default PlastfixForm
