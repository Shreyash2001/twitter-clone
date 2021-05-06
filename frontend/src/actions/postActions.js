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

       const {data} = await axios.post("/posts/create-post", {content}, config)

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

        const config = {
            headers: {
                "Content-Type":"application/json",
            }
        }
        
      const {data} = await axios.post("/posts", {userId}, config)

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

      const {data} = await axios.put(`/posts/like`, {id}, config)

      
      const newData = data?.find(function(data) {
        if(data?._id === id) {
          return data 
        } else {
            return null
        } 
    })
    


    dispatch({
        type:GET_USER_POST_SUCCESS,
        payload:data
    })

    // dispatch({
    //     type:GET_POSTBYID_SUCCESS,
    //     payload:postById
    // })
    

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

      const {data} = await axios.post(`/posts/retweets`, {id}, config)

      const newData = data?.find(function(data) {
          if(data?._id === id) {
            return data 
          } else {
              return null
          } 
      })
    
    dispatch({
        type:GET_USER_POST_SUCCESS,
        payload:data
    })

    // dispatch({
    //     type:GET_POSTBYID_SUCCESS,
    //     payload:newData
    // })

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

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

      const {data} = await axios.get(`/posts/${id}`, config)

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

       const {data} = await axios.post("/posts/create-post", {content, replyTo}, config)

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

      const {data} = await axios.delete(`/posts/${id}`, config)

    
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


