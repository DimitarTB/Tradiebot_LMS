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
    }


    // HTML
    return (
        <div className="pform">
            <h2>Internal Staff Request Form</h2>
            <form onChange={(e) => handleChange(e)} onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="manager_name">Manager Name</label><br />
                <input name="manager_name"></input><br />

                <label htmlFor="region">Region</label><br />
                <select name="region">
                    {props?.regions?.map(reg => <option value={reg}>{reg}</option>)}
                </select><br />

                <label htmlFor="technicians_number">Number of Technicians</label><br />
                <input name="technicians_number"></input><br />

                <label htmlFor="job_title">Job Title</label><br />
                <input name="job_title"></input><br />

                <label htmlFor="state">State</label><br />
                <select name="state">
                    {props?.states?.map(state => <option value={state}>{state}</option>)}
                </select><br />

                <label htmlFor="time">Part/Full Time</label><br />
                <select name="time">
                    <option value="Part Time">Part Time</option>
                    <option value="Full Time">Full Time</option>
                </select><br />

                <label htmlFor="description">Description</label><br />
                <textarea name="description"></textarea><br />
                <h6>Plastfix HR support team will review and respond to your request</h6><button type="submit">Send Staff Request</button>
            </form>
        </div>
    )
}

export default PlastfixForm
