import axios from "axios"
import { 
    GET_USER_PROFILE_FAIL,
    GET_USER_PROFILE_FOLLOWERS_FAIL,
    GET_USER_PROFILE_FOLLOWERS_REQUEST,
    GET_USER_PROFILE_FOLLOWERS_SUCCESS,
    GET_USER_PROFILE_REQUEST,
    GET_USER_PROFILE_SUCCESS
 } from "../constants/profileConstants"

export const getProfile = () => async(dispatch, getState) => {
    try {
        dispatch({type: GET_USER_PROFILE_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const {data} = await axios.get(`/profile`, config)

        dispatch({
            type:GET_USER_PROFILE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type:GET_USER_PROFILE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getProfileByUsername = (userName) => async(dispatch, getState) => {
    try {
        dispatch({type: GET_USER_PROFILE_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const {data} = await axios.get(`/profile/${userName}`, config)

        dispatch({
            type:GET_USER_PROFILE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type:GET_USER_PROFILE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getUserProfileFollowers = (userName) => async(dispatch, getState) => {
    try {
        dispatch({type: GET_USER_PROFILE_FOLLOWERS_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const {data} = await axios.get(`/profile/${userName}/followers`, config)

        dispatch({
            type:GET_USER_PROFILE_FOLLOWERS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type:GET_USER_PROFILE_FOLLOWERS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}