import axios from "axios"
import { USER_LIKE_POST_FAIL, USER_LIKE_POST_REQUEST, USER_LIKE_POST_SUCCESS } from "../constants/postConstants"
import { GET_USER_PROFILE_SUCCESS } from "../constants/profileConstants"
import { 
    USER_FOLLOW_FAIL,
    USER_FOLLOW_REQUEST,
    USER_FOLLOW_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS
 } from "../constants/userConstants"

export const userRegister = (firstName, lastName, userName, email, password) => async(dispatch) => {
    try {
        dispatch({type:USER_REGISTER_REQUEST})

        const config = {
            headers: {
                "Content-Type":"application/json"
            }
        }

        const {data} = await axios.post("/users/register", {firstName, lastName, userName, email, password}, config)

        dispatch({
            type:USER_REGISTER_SUCCESS,
            payload: data
        })
        dispatch({
            type:USER_LOGIN_SUCCESS,
            payload:data
        })
        
        localStorage.setItem("Twitter-UserInfo", JSON.stringify(data))
    } catch (error) {
        dispatch({
            type:USER_REGISTER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const userLogin = (email, userName, password) => async(dispatch) => {
    try {
        dispatch({type:USER_LOGIN_REQUEST})

        const config = {
            headers: {
                "Content-Type":"application/json"
            }
        }

        const {data} = await axios.post("/users/login", {email, userName, password}, config)

        dispatch({
            type:USER_LOGIN_SUCCESS,
            payload: data
        })
        localStorage.setItem("Twitter-UserInfo", JSON.stringify(data))
    } catch (error) {
        dispatch({
            type:USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const userLogout = () => (dispatch) => {
    localStorage.removeItem("Twitter-UserInfo")
    dispatch({type:USER_LOGOUT})
} 

export const likeUserPost = (id) => async(dispatch, getState) => {
    try {
        dispatch({type:USER_LIKE_POST_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        await axios.put(`/users/post/like`,{id}, config)

        dispatch({
            type:USER_LIKE_POST_SUCCESS,
        })
        
    } catch (error) {
        dispatch({
            type:USER_LIKE_POST_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const followUser = (id) => async(dispatch, getState) => {
    try {
        dispatch({type:USER_FOLLOW_REQUEST})

        const {userLogin: {userInfo}} = getState()
        const {userProfile: {profile}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`
            }
        }

       const {data} = await axios.put(`/users/follow`,{id}, config)
        
      const newData = {
        userProfile: data,
        posts: profile?.posts,
        replies: profile?.replies
      }  

            dispatch({
                type:GET_USER_PROFILE_SUCCESS,
                payload: newData
            })

        dispatch({
            type:USER_FOLLOW_SUCCESS,
        })
        
    } catch (error) {
        dispatch({
            type:USER_FOLLOW_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}