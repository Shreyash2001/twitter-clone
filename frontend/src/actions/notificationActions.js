import axios from "axios"
import { useSelector } from "react-redux"
import { Socket } from "socket.io"
import { GET_NOTIFICATION_FAIL, GET_NOTIFICATION_REQUEST, GET_NOTIFICATION_SUCCESS, GET_UNREAD_NOTIFICATION_FAIL, GET_UNREAD_NOTIFICATION_REQUEST, GET_UNREAD_NOTIFICATION_SUCCESS, UPDATE_ALL_NOTIFICATION_REQUEST, UPDATE_NOTIFICATION_FAIL, UPDATE_NOTIFICATION_REQUEST } from "../constants/notificationConstants"

export const getUserNotification = () => async(dispatch, getState) => {
    try {
        dispatch({type: GET_NOTIFICATION_REQUEST})
        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const {data} = await axios.get("/notification", config)

        dispatch({
            type: GET_NOTIFICATION_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: GET_NOTIFICATION_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getUnreadNotification = () => async(dispatch, getState) => {
    try {
        dispatch({type: GET_UNREAD_NOTIFICATION_REQUEST})
        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const {data} = await axios.get("/notification/unread", config)

        dispatch({
            type: GET_UNREAD_NOTIFICATION_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: GET_UNREAD_NOTIFICATION_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const updateUserNotification = (id) => async(dispatch, getState) => {
    try {
        dispatch({type: UPDATE_NOTIFICATION_REQUEST})
        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        await axios.put(`/notification`, {id}, config)

    } catch (error) {
        dispatch({
            type: UPDATE_NOTIFICATION_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const updateAllUserNotification = () => async(dispatch, getState) => {
    try {
        dispatch({type: UPDATE_ALL_NOTIFICATION_REQUEST})
        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
      const {data} = await axios.get(`/notification/mark-all-read`, config)

      dispatch({
        type: GET_NOTIFICATION_SUCCESS,
        payload: data
    })

    } catch (error) {
        dispatch({
            type: UPDATE_NOTIFICATION_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}
