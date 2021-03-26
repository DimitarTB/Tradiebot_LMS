import { createSlice } from '@reduxjs/toolkit'
import { API_URL, statuses } from '../constants'
import { addTeacher, changePassword, changeUsername, enrollCourse, enrollUserCourse, fetchAll, getOneUser, loginUser, profilePicture, removeTeacher, unEnrollCourse, unenrollUserCourse } from "./UserActions"
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
        currentUserData: null,
        profilePictureStatus: statuses.idle,
        changePasswordStatus: statuses.idle,
        changeUsernameStatus: statuses.idle,
        usernameError: null,
        startedWatching: null
    },
    reducers: {
        logout: (state) => {
            state.currentUser = null
            state.currentUserData = null
            state.loadingStatus = statuses.idle
            state.loginStatus = statuses.idle
            state.registerStatus = statuses.idle
        },
        startWatching: (state, action) => {
            const stW = { "time": new Date(), "course": action.payload.id }
            state.startedWatching = stW
        },
        stopWatching: (state, action) => {
            const watchingTime = (new Date()).getTime() - Date.parse(state.startedWatching.time)
            var myHeaders = new Headers();
            myHeaders.append("Authorization", ("Bearer " + state.currentUser));
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "course_id": action.payload.id, "time_watched": watchingTime, "started_watching": state.startedWatching.time });
            state.startedWatching = null
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(API_URL + "/api/watched_course", requestOptions)
        },
        addCreatedCourse: (state, action) => {
            state.currentUserData.createdCourses.push(action.payload._id)
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

        [getOneUser.fulfilled]: (state, action) => {
            const find_user = state.allUsers.indexOf(usr => usr._id === action.payload.user._id)
            if (find_user === -1) {
                state.allUsers.push(action.payload.user)
            }
            else state.allUsers[find_user] = action.payload.user
            if (action.payload.user._id === state.currentUserData._id) state.currentUserData = action.payload.user
        },


        [loginUser.pending]: (state, action) => {
            state.currentUser = null
            state.loginStatus = statuses.pending
        },
        [loginUser.fulfilled]: (state, action) => {
            state.currentUser = action.payload
            state.loginStatus = statuses.fulfilled
            console.log(state.currentUser)
            const decodedPl = jwt_decode(state.currentUser)
            const decoded = decodedPl.identity
            const expDate = (new Date(decodedPl.exp * 1000)).toString()
            console.log(decoded)
            const new_user = { "_id": decoded._id, "username": decoded.username, "email": decoded.email, "types": decoded.types, "enrolledCourses": decoded.enrolledCourses, "createdCourses": decoded.createdCourses, "activated": decoded.activated, "profile_picture": decoded.profile_picture, "token_exp": expDate }
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
        },

        [profilePicture.fulfilled]: (state, action) => {
            const upd_user = state.allUsers.findIndex(usr => usr.username === action.payload.username)
            const new_user = state.allUsers[upd_user]
            new_user.profile_picture = action.payload.picture
            state.allUsers[upd_user] = new_user
            state.currentUserData = new_user
            state.profilePictureStatus = statuses.fulfilled
        },
        [profilePicture.pending]: (state, action) => {
            state.profilePictureStatus = statuses.pending
        },
        [profilePicture.rejected]: (state, action) => {
            state.profilePictureStatus = statuses.rejected
        },

        [changePassword.fulfilled]: (state) => {
            state.changePasswordStatus = statuses.fulfilled
        },
        [changePassword.pending]: (state) => {
            state.changePasswordStatus = statuses.pending
        },
        [changePassword.rejected]: (state) => {
            state.changePasswordStatus = statuses.rejected
        },

        [changeUsername.fulfilled]: (state, action) => {
            state.changeUsernameStatus = statuses.fulfilled
            const upd_user = state.allUsers.indexOf(usr => state.currentUserData.username === usr.username)
            console.log(upd_user)
            if (upd_user === -1) {
                state.currentUserData.username = action.payload.username
                state.currentUserData.email = action.payload.email
                console.log(state.currentUser, action.payload.token)
                state.currentUser = action.payload.token
                console.log(state.currentUser)
                return
            }
            state.allUsers[upd_user].username = action.payload.username
            state.allUsers[upd_user].email = action.payload.email

            state.currentUserData.username = action.payload.username
            state.currentUserData.email = action.payload.email
            state.currentUser = action.payload.token
        },
        [changeUsername.rejected]: (state, action) => {
            state.changeUsernameStatus = statuses.rejected
            state.usernameError = action.payload.message
        },
        [changeUsername.pending]: (state) => {
            state.changeUsernameStatus = statuses.pending
        },

        [addTeacher.fulfilled]: (state, action) => {
            const idx = state.allUsers.findIndex(usr => usr._id === action.payload.id)
            state.allUsers[idx].types.push("Teacher")
        },

        [removeTeacher.fulfilled]: (state, action) => {
            console.log(action.payload.id)
            const idx = state.allUsers.findIndex(usr => usr._id === action.payload.id)
            console.log(idx)
            const roles = state.allUsers[idx].types.filter(role => role !== "Teacher")
            state.allUsers[idx].types = roles
            console.log(state.allUsers[idx])
        },

        [unenrollUserCourse.fulfilled]: (state, action) => {
            const usr = state.allUsers.findIndex(usr => usr._id === action.payload.user_id)
            state.allUsers[usr].enrolledCourses = state.allUsers[usr].enrolledCourses.filter(crs => crs !== action.payload.course_id)
        },

        [enrollUserCourse.fulfilled]: (state, action) => {
            const usr = state.allUsers.findIndex(usr => usr._id === action.payload.user_id)
            state.allUsers[usr].enrolledCourses.push(action.payload.course_id)
        }
    },
})


export const {

} = UserSlice.actions

export default UserSlice.reducer