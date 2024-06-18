import axios from "axios"
import { USER_LIKE_POST_FAIL, USER_LIKE_POST_REQUEST, USER_LIKE_POST_SUCCESS } from "../constants/postConstants"
import { GET_USER_PROFILE_SUCCESS } from "../constants/profileConstants"
import { 
    USER_FOLLOWERS_FOLLOWING_FAIL,
    USER_FOLLOWERS_FOLLOWING_REQUEST,
    USER_FOLLOWERS_FOLLOWING_SUCCESS,
    USER_FOLLOW_FAIL,
    USER_FOLLOW_REQUEST,
    USER_FOLLOW_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_SEARCH_FAIL,
    USER_SEARCH_REQUEST,
    USER_SEARCH_SUCCESS,
    USER_UPDATE_COVER_IMAGE_FAIL,
    USER_UPDATE_COVER_IMAGE_REQUEST,
    USER_UPDATE_IMAGE_FAIL,
    USER_UPDATE_IMAGE_REQUEST,
 } from "../constants/userConstants"

export const userRegister = (firstName, lastName, userName, email, password) => async(dispatch) => {
    try {
        dispatch({type:USER_REGISTER_REQUEST})

        const config = {
            headers: {
                "Content-Type":"application/json"
            }
        }

        const {data} = await axios.post("https://twitter-clone-api-five.vercel.app/api/users/register", {firstName, lastName, userName, email, password}, config)

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

        const {data} = await axios.post("https://twitter-clone-api-five.vercel.app/api/users/login", {email, userName, password}, config)

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

        await axios.put(`https://twitter-clone-api-five.vercel.app/api/users/post/like`,{id}, config)

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

       const {data} = await axios.put(`https://twitter-clone-api-five.vercel.app/api/users/follow`, {id}, config)
        
      const newData = {
        userProfile: data.user,
        posts: profile?.posts,
        replies: profile?.replies
      }  

            dispatch({
                type:GET_USER_PROFILE_SUCCESS,
                payload: newData
            })

            dispatch({
                type:USER_FOLLOWERS_FOLLOWING_SUCCESS,
                payload: data.loggedInUser
            })
            
        
    } catch (error) {
        dispatch({
            type:USER_FOLLOW_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getLoggedInUserfollowers = () => async(dispatch, getState) => {
    try {
        dispatch({type:USER_FOLLOWERS_FOLLOWING_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`
            }
        }

       const {data} = await axios.get(`https://twitter-clone-api-five.vercel.app/api/users/follow`, config)
            

        dispatch({
            type:USER_FOLLOWERS_FOLLOWING_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type:USER_FOLLOWERS_FOLLOWING_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const updateUserImage = (url) => async(dispatch, getState) => {
    try {
        dispatch({type:USER_UPDATE_IMAGE_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`
            }
        }

       const {data} = await axios.put(`https://twitter-clone-api-five.vercel.app/api/users/update-image`, {url}, config)
      
        userInfo.image = data?.userProfile?.image
        localStorage.setItem("Twitter-UserInfo", JSON.stringify({
            id: userInfo?.id,
            firstName: userInfo?.firstName,
            lastName: userInfo?.lastName,
            userName: userInfo?.userName,
            email: userInfo?.email,
            image: data?.userProfile?.image,
            following: userInfo?.following,
            followers: userInfo?.followers,
            token: userInfo?.token
        }))
        
       dispatch({
        type:GET_USER_PROFILE_SUCCESS,
        payload: data
    })
        
    } catch (error) {
        dispatch({
            type:USER_UPDATE_IMAGE_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const updateUserCoverImage = (url) => async(dispatch, getState) => {
    try {
        dispatch({type:USER_UPDATE_COVER_IMAGE_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`
            }
        }

       const {data} = await axios.put(`https://twitter-clone-api-five.vercel.app/api/users/update-coverPhoto`, {url}, config)
      
        userInfo.image = data?.userProfile?.image
        localStorage.setItem("Twitter-UserInfo", JSON.stringify({
            id: userInfo?.id,
            firstName: userInfo?.firstName,
            lastName: userInfo?.lastName,
            userName: userInfo?.userName,
            email: userInfo?.email,
            image: data?.userProfile?.image,
            following: userInfo?.following,
            followers: userInfo?.followers,
            token: userInfo?.token
        }))
        
       dispatch({
        type:GET_USER_PROFILE_SUCCESS,
        payload: data
    })
        
    } catch (error) {
        dispatch({
            type:USER_UPDATE_COVER_IMAGE_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const getSearchedUsers = (search) => async(dispatch, getState) => {
    try {
        dispatch({type:USER_SEARCH_REQUEST})

        const {userLogin: {userInfo}} = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo?.token}`
            }
        }

       const {data} = await axios.get(`https://twitter-clone-api-five.vercel.app/api/users/search?users=${search}`, config)
            

        dispatch({
            type:USER_SEARCH_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type:USER_SEARCH_FAIL,
            error: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}