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
    USER_RETWEET_POST_REQUEST,
    USER_RETWEET_POST_FAIL,
    GET_POSTBYID_REQUEST,
    GET_POSTBYID_SUCCESS,
    GET_POSTBYID_FAIL,
    DELETE_POSTBYID_REQUEST,
    DELETE_POSTBYID_SUCCESS,
    DELETE_POSTBYID_FAIL,
    PIN_POSTBYID_REQUEST,
    PIN_POSTBYID_FAIL,
    POST_SEARCH_REQUEST,
    POST_SEARCH_SUCCESS,
    POST_SEARCH_FAIL,
 } from "../constants/postConstants"

export const createPost = (content, image) => async(dispatch, getState) => {
    try {
        dispatch({type:USER_POST_CREATE_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

       const {data} = await axios.post("/api/posts/create-post", {content, image}, config)

        dispatch({
            type:USER_POST_CREATE_SUCCESS,
        })
        dispatch({
            type:GET_USER_POST_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type:USER_POST_CREATE_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}


export const getPosts = (userId) => async(dispatch, getState) => {
    try {
        dispatch({type:GET_USER_POST_REQUEST})

      const {data} = await axios.post("/api/posts", {userId})

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

        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

      const {data} = await axios.put(`/api/posts/like`, {id}, config)


    dispatch({
        type:GET_USER_POST_SUCCESS,
        payload:data
    })
    

    } catch (error) {
        dispatch({
            type:USER_LIKE_POST_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const retweetPost = (id) => async(dispatch, getState) => {
    
    try {
        dispatch({type:USER_RETWEET_POST_REQUEST})

        const {userLogin: {userInfo}} = getState()


        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

      const {data} = await axios.post(`/api/posts/retweets`, {id}, config)
    
    dispatch({
        type:GET_USER_POST_SUCCESS,
        payload:data
    })

    } catch (error) {
        dispatch({
            type:USER_RETWEET_POST_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getPostById = (id) => async(dispatch, getState) => {
    
    try {
        dispatch({type:GET_POSTBYID_REQUEST})

        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        }

      const {data} = await axios.get(`/api/posts/${id}`, config)

    dispatch({
        type:GET_POSTBYID_SUCCESS,
        payload:data
    })

    } catch (error) {
        dispatch({
            type:GET_POSTBYID_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const replyPost = (content, replyTo) => async(dispatch, getState) => {
    try {

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

       const {data} = await axios.post("/api/posts/create-post", {content, replyTo}, config)

        dispatch({
            type:GET_USER_POST_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type:USER_POST_CREATE_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const deletePostById = (id) => async(dispatch, getState) => {
    
    try {
        dispatch({type:DELETE_POSTBYID_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

      const {data} = await axios.delete(`/api/posts/${id}`, config)

    
    dispatch({
        type:DELETE_POSTBYID_SUCCESS,
    })

    dispatch({
        type:GET_USER_POST_SUCCESS,
        payload:data
    })

    } catch (error) {
        dispatch({
            type:DELETE_POSTBYID_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const pinPostById = (id, pinned) => async(dispatch, getState) => {
    
    try {
        dispatch({type:PIN_POSTBYID_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

      const {data} = await axios.put(`/api/posts/${id}`,{pinned}, config)


    dispatch({
        type:GET_USER_POST_SUCCESS,
        payload:data
    })

    } catch (error) {
        dispatch({
            type:PIN_POSTBYID_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getSearchedPosts = (search) => async(dispatch, getState) => {
    try {
        dispatch({type:POST_SEARCH_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`
            }
        }

       const {data} = await axios.get(`/api/posts/search?posts=${search}`, config)
            

        dispatch({
            type:POST_SEARCH_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type:POST_SEARCH_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}


