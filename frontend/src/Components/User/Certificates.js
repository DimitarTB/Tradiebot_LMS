import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getAllCertificates } from '../../redux/Users/UserActions'
import Container from '../Global/Container'

function Certificates() {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user)
    const userCertificates = useSelector(state => state.user?.allCertificates?.filter(cert => cert?.user_id === currentUser?.currentUserData?._id))
    useEffect(() => {
        dispatch(getAllCertificates())
    }, [])
    return (
        <Container component={
            userCertificates.map(cert => <img src={cert.data} />)
        }></Container>
    )
}

export default Certificates
