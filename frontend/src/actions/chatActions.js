import axios from "axios"
import {CREATE_CHAT_FAIL, CREATE_CHAT_REQUEST, CREATE_CHAT_SUCCESS, CREATE_MESSAGE_FAIL, CREATE_MESSAGE_REQUEST, CREATE_MESSAGE_SUCCESS, GET_CHATSBYID_FAIL, GET_CHATSBYID_REQUEST, GET_CHATSBYID_SUCCESS, GET_CHAT_FAIL, GET_CHAT_REQUEST, GET_CHAT_SUCCESS, GET_MESSAGE_FAIL, GET_MESSAGE_REQUEST, GET_MESSAGE_SUCCESS, GET_UNREAD_MESSAGE_FAIL, GET_UNREAD_MESSAGE_REQUEST, GET_UNREAD_MESSAGE_SUCCESS, UPDATE_CHATNAME_FAIL, UPDATE_CHATNAME_REQUEST} from "../constants/chatConstants"

export const createChat = (users) => async(dispatch, getState) => {
    try {
        dispatch({type:CREATE_CHAT_REQUEST})
        const {userLogin:{userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
       const {data} = await axios.post("/chat", {users}, config)
       
        dispatch({
            type:CREATE_CHAT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type:CREATE_CHAT_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getChats = () => async(dispatch, getState) => {
    try {
        dispatch({type:GET_CHAT_REQUEST})
        const {userLogin:{userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
       const {data} = await axios.get("/chat", config)
       
        dispatch({
            type:GET_CHAT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type:GET_CHAT_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getunreadMessage = () => async(dispatch, getState) => {
    try {
        dispatch({type:GET_UNREAD_MESSAGE_REQUEST})
        const {userLogin:{userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
       const {data} = await axios.get("/chat/unread", config)

        dispatch({
            type:GET_UNREAD_MESSAGE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type:GET_UNREAD_MESSAGE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getChatsById = (id) => async(dispatch, getState) => {
    try {
        dispatch({type:GET_CHATSBYID_REQUEST})
        const {userLogin:{userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
       const {data} = await axios.get(`/chat/${id}`, config)
       
        dispatch({
            type:GET_CHATSBYID_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type:GET_CHATSBYID_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const updateChatName = (id, name) => async(dispatch, getState) => {
    try {
        dispatch({type: UPDATE_CHATNAME_REQUEST})
        const {userLogin:{userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
       const {data} = await axios.put(`/chat/${id}`, {name}, config)
       
       dispatch({
        type:GET_CHATSBYID_SUCCESS,
        payload: data
    })

    } catch (error) {
        dispatch({
            type: UPDATE_CHATNAME_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const createMessage = (id, message) => async(dispatch, getState) => {
    try {
        dispatch({type: CREATE_MESSAGE_REQUEST})
        const {userLogin:{userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
       const {data} = await axios.post(`/messages`, {id, message}, config)

       dispatch({
        type: GET_MESSAGE_SUCCESS,
        payload: data
    })

    } catch (error) {
        dispatch({
            type: CREATE_MESSAGE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getMessages = (id) => async(dispatch, getState) => {
    try {
        dispatch({type: GET_MESSAGE_REQUEST})
        const {userLogin:{userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
       const {data} = await axios.get(`/messages/${id}`, config)

       const newData = {
           chats: data
       }

       dispatch({
           type: GET_MESSAGE_SUCCESS,
           payload: newData
       })

    } catch (error) {
        dispatch({
            type: GET_MESSAGE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}