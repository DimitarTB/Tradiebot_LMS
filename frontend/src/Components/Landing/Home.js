import { isKeyboardEvent } from '@material-ui/data-grid'
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { Redirect, useParams } from 'react-router'
import Container from '../Global/Container'

function Home(props) {
    const activated = useParams().activate
    const [redirect, setRedirect] = useState(false)
    useEffect(() => {
        if (activated === "activate") {
            alert("Your account is successfully activated!")
            setRedirect(true)
        }
    }, [])
    return redirect === true ? <Redirect to="/home" /> : (
        <Container
            details={"Default Container Details"}
            description="Description about default container details"

            component={(
                <Fragment>
                    <h1>Hello World</h1>
                    <h2>H2 tag</h2>
                    <h3>Hello again</h3>
                </Fragment>
            )}
            icon="book.png"
        >
        </Container>
    )
}

export default Home
