import axios from "axios"
import { 
    USER_POST_CREATE_REQUEST,
    USER_POST_CREATE_SUCCESS,
    USER_POST_CREATE_FAIL,
    GET_USER_POST_REQUEST,
    GET_USER_POST_SUCCESS,
    GET_USER_POST_FAIL,
    USER_LIKE_POST_REQUEST,
    USER_LIKE_POST_FAIL,
 } from "../constants/postConstants"

export const createPost = (content) => async(dispatch, getState) => {
    try {
        dispatch({type:USER_POST_CREATE_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        await axios.post("/posts/create-post", {content}, config)

        dispatch({
            type:USER_POST_CREATE_SUCCESS,
        })
        dispatch({
            type:GET_USER_POST_SUCCESS,
        })
        
    } catch (error) {
        dispatch({
            type:USER_POST_CREATE_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}


export const getPosts = () => async(dispatch) => {
    try {
        dispatch({type:GET_USER_POST_REQUEST})

        const config = {
            headers: {
                "Content-Type":"application/json"
            }
        }

      const {data} = await axios.get("/posts", config)

        dispatch({
            type:GET_USER_POST_SUCCESS,
            payload:data
        })
        
    } catch (error) {
        dispatch({
            type:GET_USER_POST_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const likePost = (id) => async(dispatch, getState) => {
    
    try {
        dispatch({type:USER_LIKE_POST_REQUEST})

        const {userLogin: {userInfo}} = getState()
        const {getAllPosts:{posts}} = getState()

        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

      const {data} = await axios.put(`/posts/like`, {id}, config)


      const newData = posts?.map(item => {
        if(item._id === data._id){
            return data
        }else {
            return item
        }
    })
    
    dispatch({
        type:GET_USER_POST_SUCCESS,
        payload:newData
    })

    } catch (error) {
        dispatch({
            type:USER_LIKE_POST_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}



