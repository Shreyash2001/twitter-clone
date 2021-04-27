import axios from "axios"
import { 
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