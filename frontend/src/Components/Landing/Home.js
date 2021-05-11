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
            details={"Tradiebot LMS"}
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec velit lacus, congue et elit in, finibus efficitur justo. Donec ac mollis neque, sed ullamcorper arcu. Fusce eu arcu odio. In hac habitasse platea dictumst. Quisque ullamcorper pretium scelerisque. Sed vel nunc et nulla porttitor finibus. Aenean ultrices volutpat urna, volutpat congue dolor dictum ac. Donec leo purus, posuere a augue egestas, varius rutrum turpis."

            component={(
                <Fragment>
                    <p style={{width: "70%", marginLeft: "auto", marginRight: "auto", textAlign: "center", marginTop: "20px"}}>Phasellus at congue massa, eget pellentesque quam. Aliquam vel convallis nisl. Vestibulum erat turpis, rhoncus sed faucibus sit amet, luctus sed lorem. Sed elementum sapien dolor, ut tristique massa gravida semper. Aenean nec accumsan turpis. Curabitur varius quam at nisi tempus vestibulum. Vestibulum imperdiet, ipsum eu tincidunt bibendum, nulla magna ultrices arcu, vitae aliquet nunc odio volutpat ligula. Suspendisse placerat quam dolor, et imperdiet lorem blandit ac. Nullam id purus eu arcu maximus pharetra. Curabitur id tincidunt est, id venenatis dolor. Curabitur vel leo sit amet eros hendrerit vulputate vitae aliquam dolor. Sed eleifend enim vel neque venenatis, a viverra orci tincidunt. Sed in ligula a mauris vestibulum dapibus at a nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vestibulum hendrerit quam, vel fermentum neque auctor non.</p>
                </Fragment>
            )}
            icon="book.png"
        >
        </Container>
    )
}

export default Home
