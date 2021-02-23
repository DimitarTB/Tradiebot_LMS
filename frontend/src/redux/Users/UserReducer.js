import { createSlice } from '@reduxjs/toolkit'
import { statuses } from '../constants'
import { enrollCourse, fetchAll, loginUser, unEnrollCourse } from "./UserActions"
import jwt_decode from "jwt-decode"
import { register } from './UserActions'

export const UserSlice = createSlice({
    name: 'user',
    initialState: {
        allUsers: [],
        currentUser: null,
        loadingStatus: statuses.idle,
        loginStatus: statuses.idle,
        registerStatus: statuses.idle,
        registerError: null,
        currentUserData: null
    },
    reducers: {
        logout: (state) => {
            state.currentUser = null
            state.currentUserData = null
            state.loadingStatus = statuses.idle
            state.loginStatus = statuses.idle
            state.registerStatus = statuses.idle
        }
    },
    extraReducers: {
        [fetchAll.pending]: (state, action) => {
            state.allUsers = []
            state.loadingStatus = statuses.pending
        },
        [fetchAll.fulfilled]: (state, action) => {
            state.allUsers = action.payload
            state.loadingStatus = statuses.fulfilled
        },
        [fetchAll.rejected]: (state, action) => {
            state.loadingError = action.payload
            state.loadingStatus = statuses.rejected
        },



        [loginUser.pending]: (state, action) => {
            state.currentUser = null
            state.loginStatus = statuses.pending
        },
        [loginUser.fulfilled]: (state, action) => {
            state.currentUser = action.payload
            state.loginStatus = statuses.fulfilled
            console.log(state.currentUser)
            const decoded = jwt_decode(state.currentUser).identity
            const new_user = { "_id": decoded._id, "username": decoded.username, "email": decoded.email, "roles": decoded.types, "enrolledCourses": decoded.enrolledCourses, "createdCourses": decoded.createdCourses, "activated": decoded.activated }
            state.currentUserData = new_user

            console.log(state.currentUserData)
        },
        [loginUser.rejected]: (state, action) => {
            state.loginError = action.payload
            state.loginStatus = statuses.rejected
            alert("Invalid combination of username/e-mail and password!!!")
        },


        [register.pending]: (state, action) => {
            state.registerStatus = statuses.pending
        },
        [register.fulfilled]: (state, action) => {
            state.allUsers.push(action.payload)
            state.registerStatus = statuses.fulfilled
            console.log("FF")
        },
        [register.rejected]: (state, action) => {
            state.registerError = action.payload
            state.registerStatus = statuses.rejected
        },

        [enrollCourse.fulfilled]: (state, action) => {
            console.log("PL", action.payload)
            state.currentUserData.enrolledCourses = [...state.currentUserData.enrolledCourses, action.payload._id]
        },

        [unEnrollCourse.fulfilled]: (state, action) => {
            console.log(action.payload._id)
            state.currentUserData.enrolledCourses = state.currentUserData.enrolledCourses.filter(course => course !== action.payload._id)
        }
    },
})


export const {

} = UserSlice.actions

export default UserSlice.reducer