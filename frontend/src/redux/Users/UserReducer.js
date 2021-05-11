import { createSlice } from '@reduxjs/toolkit'
import { API_URL, statuses } from '../constants'
import { activateUser, addTeacher, changePassword, changeUsername, enrollCourse, enrollUserCourse, fetchAll, getOneUser, loginUser, profilePicture, removeTeacher, unEnrollCourse, unenrollUserCourse, getAllCertificates, addCertificate } from "./UserActions"
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
        startedWatching: null,
        activateStatus: statuses.idle,
        activateMessage: "",
        allCertificates: [],
        unenrollUserCourseStatus: statuses.idle,
        enrollUserCourseStatus: statuses.idle
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
            const stW = { "time": (new Date()).toString(), "course": action.payload.id }
            state.startedWatching = stW

        },
        stopWatching: (state, action) => {
            const watchingTime = (new Date()).getTime() - Date.parse(state.startedWatching.time)
            // console.log(state.startedWatching.time)
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

            fetch(API_URL + "api/watched_course", requestOptions)
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
            // const find_user = state.allUsers.indexOf(usr => {
            //     console.log(usr._id)
            //     console.log(action.payload._id)
            //     return (usr._id === action.payload.user._id)
            // })
            // if (find_user === -1) {
            //     state.allUsers.push(action.payload.user)
            // }
            // else state.allUsers[find_user] = action.payload.user
            const all_users = [...state.allUsers]
            const idx = all_users.findIndex(usr => usr._id === action.payload.user._id)
            if(idx === -1) all_users.push(action.payload.user)
            else all_users[idx] = action.payload.user
            state.allUsers = all_users
            if (action.payload.user?._id === state.currentUserData?._id) {
                const token_exp = state.currentUserData.token_exp
                state.currentUserData = action.payload.user
                state.currentUserData.token_exp = token_exp
            }
        },


        [loginUser.pending]: (state, action) => {
            state.currentUser = null
            state.loginStatus = statuses.pending
        },
        [loginUser.fulfilled]: (state, action) => {
            state.currentUser = action.payload
            state.loginStatus = statuses.fulfilled
            const decodedPl = jwt_decode(state.currentUser)
            const decoded = decodedPl.identity
            const expDate = (new Date(decodedPl.exp * 1000)).toString()
            const new_user = { "_id": decoded._id, "username": decoded.username, "email": decoded.email, "types": decoded.types, "enrolledCourses": decoded.enrolledCourses, "createdCourses": decoded.createdCourses, "activated": decoded.activated, "profile_picture": decoded.profile_picture, "token_exp": expDate, "bio": decoded.bio }
            state.currentUserData = new_user
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
        },
        [register.rejected]: (state, action) => {
            state.registerError = action.payload
            state.registerStatus = statuses.rejected
        },

        [enrollCourse.fulfilled]: (state, action) => {
            state.currentUserData.enrolledCourses = [...state.currentUserData.enrolledCourses, action.payload._id]
        },

        [unEnrollCourse.fulfilled]: (state, action) => {
            state.currentUserData.enrolledCourses = state.currentUserData.enrolledCourses.filter(course => course !== action.payload._id)
        },

        [profilePicture.fulfilled]: (state, action) => {
            const upd_user = state.allUsers.findIndex(usr => usr.username === action.payload.username)
            const new_user = state.allUsers[upd_user]
            new_user.profile_picture = action.payload.picture
            state.allUsers[upd_user] = new_user
            state.currentUserData.profile_picture = new_user.profile_picture
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
            if (upd_user === -1) {
                state.currentUserData.username = action.payload.username
                state.currentUserData.email = action.payload.email
                state.currentUserData.bio = action.payload.bio
                state.currentUser = action.payload.token
                return
            }
            state.allUsers[upd_user].username = action.payload.username
            state.allUsers[upd_user].email = action.payload.email
            state.allUsers[upd_user].bio = action.payload.bio

            state.currentUserData.username = action.payload.username
            state.currentUserData.email = action.payload.email
            state.currentUserData.bio = action.payload.bio
            state.currentUser = action.payload.token
        },
        [changeUsername.rejected]: (state, action) => {
            state.changeUsernameStatus = statuses.rejected
            state.usernameError = action.payload
        },
        [changeUsername.pending]: (state) => {
            state.changeUsernameStatus = statuses.pending
        },

        [activateUser.fulfilled]: (state, action) => {
            state.activateMessage = action.payload.message
            state.activateStatus = statuses.fulfilled
        },
        [activateUser.pending]: (state) => {
            state.activateMessage = ""
            state.activateStatus = statuses.pending
        },

        [addTeacher.fulfilled]: (state, action) => {
            const idx = state.allUsers.findIndex(usr => usr._id === action.payload.id)
            state.allUsers[idx].types.push("Teacher")
        },

        [removeTeacher.fulfilled]: (state, action) => {
            const idx = state.allUsers.findIndex(usr => usr._id === action.payload.id)
            const roles = state.allUsers[idx].types.filter(role => role !== "Teacher")
            state.allUsers[idx].types = roles
        },

        [unenrollUserCourse.fulfilled]: (state, action) => {
            const usr = state.allUsers.findIndex(usr => usr._id === action.payload.user_id)
            state.allUsers[usr].enrolledCourses = state.allUsers[usr].enrolledCourses.filter(crs => crs !== action.payload.course_id)
            state.unenrollUserCourseStatus = statuses.fulfilled
        },

        [unenrollUserCourse.pending]: (state) => {
            state.unenrollUserCourseStatus = statuses.pending
        },

        [enrollUserCourse.fulfilled]: (state, action) => {
            const usr = state.allUsers.findIndex(usr => usr._id === action.payload.user_id)
            state.allUsers[usr].enrolledCourses.push(action.payload.course_id)
            state.enrollUserCourseStatus = statuses.fulfilled
        },
        [enrollUserCourse.pending]: (state) => {
            state.enrollUserCourseStatus = statuses.pending
        },

        [getAllCertificates.fulfilled]: (state, action) => {
            state.allCertificates = action.payload
        },

        [addCertificate.fulfilled]: (state, action) => {
            state.allCertificates.push(action.payload)
        }
    },
})


export const {

} = UserSlice.actions

export default UserSlice.reducer