import React from 'react'
import "./print.css"

function PrintFile() {
    return (
        <div>
            <div className="container" id="ViewJob">
                <div className="details" style={{ opacity: 1 }}>
                    <h1>Job Data</h1>
                    <h3>Data and actions regarding the selected job.</h3>
                </div>
                <div id="actions" style={{ opacity: 1 }} >
                    <div className="actionTabs"><p>No actions you can perform</p></div>
                    <div className="actionComponents"></div>
                </div>
                
                <div id="Info" className="">

                    <span>
                        <p>Order Number</p>
                        <p>NIK123</p>
                    </span>
                    <span>
                        <p>License</p>
                        <p>GT543243</p>
                    </span>
                    <span>
                        <p>Client</p>
                        <p>banyo-smart</p>
                    </span>
                    <span>
                        <p>Technician</p>
                        <p>Tradiebot_MK</p>
                    </span>
                    <span><p>Status</p><p>Cancel Request</p>
                    </span><span>
                        <p>Order Date</p>
                        <p>24 Mar 2021 23:52</p>
                    </span><span>
                        <p>Start Date</p>
                        <p>31 Mar 2021 14:32</p>
                    </span>
                    <span><p>Finish Date</p><p>Not Finished</p></span>
                    <span><p>Price</p><p>200</p></span>
                    <span><p>Make</p><p>ALFA ROMEO</p></span>
                    <span><p>Model</p><p>GT</p></span>
                    <span><p>Year</p><p>2009</p></span>
                    <span><p>Color</p><p>RED</p></span>
                    <span><p>Body Type</p><p>Compact</p></span>
                    <span><p>Part</p><p>Boot Spoilers</p></span>
                    <span><p>Part Weight (kg)</p><p></p></span>
                    <span><p>Impact Level</p><p></p></span>
                    <span><p>Decline Number</p><p></p></span>
                </div>
                <div id="text"><h2>Text</h2></div>
                <div className="pagebreak"> </div>
                <div className="documents" style={{ display: "block" }}></div>
                <div id="Data">
                    <span className="image"><p>24 Mar 2021 23:52</p>
                        <div className="showing">
                            <img src="http://demo.worxmanager.com:88/worx_manager/public/images/job_9_file_1616626333809926.png" />
                        </div>
                        <p><strong>Allocated </strong> -  </p>
                    </span><div className="pagebreak" />
                    <span className="image"><p>24 Mar 2021 23:52</p>
                        <div className="showing">
                            <img src="http://demo.worxmanager.com:88/worx_manager/public/images/job_9_file_1616626333809926.png" />
                        </div>
                        <p><strong>Allocated </strong> -  </p>
                    </span><div className="pagebreak" />
                    <span className="image"><p>24 Mar 2021 23:52</p>
                        <div className="showing">
                            <img src="http://demo.worxmanager.com:88/worx_manager/public/images/job_9_file_1616626333809926.png" />
                        </div>
                        <p><strong>Allocated </strong> -  </p>
                    </span><div className="pagebreak" />
                    <span className="timeline">
                        <p>25 Mar 2021 17:56 : Admin changed the status from Ready to Allocated</p>
                    </span>
                    <span className="timeline">
                        <p>31 Mar 2021 14:32 : Tradiebot_MK changed the status from Allocated to Started</p>
                    </span>
                    <span className="timeline"><p>31 Mar 2021 14:32 : Tradiebot_MK changed the status from Started to Cancel Request</p></span>
                    <button style={{ dispay: "block" }} onClick={e => {
                        const element = e.target
                        e.preventDefault()
                        window.addEventListener("beforeprint", () => {
                            const images = document.querySelectorAll("#Data > .image > div")
                            for (let i of images) {
                                i.classList.add("showing")
                            }
                            element.style.display = "none"
                            document.querySelectorAll("#ViewJob > .documents")[0].style.display = "none"
                            document.getElementById("Info").classList.add("marginProp")
                            // document.getElementById("Nav").style.opacity = "0"
                            document.getElementById("actions").style.opacity = "0"
                            document.querySelectorAll("#ViewJob > .details")[0].style.opacity = "0"
                            document.getElementById("Info").style.transform = "scale(0.7)"
                            // document.getElementById("Data").style.marginTop = "50cm"
                            document.getElementById("Data").style.marginRight = "13cm"
                            document.getElementById("Data").style.marginTop = "5cm"
                            document.getElementsByClassName("image")[0].style.marginTop = "2cm"
                            document.getElementsByClassName("image")[0].style.transform = "scale(0.7)"


                        });
                        window.addEventListener("afterprint", () => {
                            const images = document.querySelectorAll("#Data > .image > div")
                            for (let i of images) {
                                i.classList.remove("showing")
                            }
                            element.style.display = "block"
                            document.querySelectorAll("#ViewJob > .documents")[0].style.display = "block"
                            document.getElementById("Info").classList.remove("marginProp")
                            // document.getElementById("Nav").style.opacity = "1"
                            document.getElementById("actions").style.opacity = "1"
                            document.querySelectorAll("#ViewJob > .details")[0].style.opacity = "1"
                        });
                        window.print()
                    }
                    }>Print</button>
                </div>
            </div>
        </div>
    )
}

export default PrintFile
