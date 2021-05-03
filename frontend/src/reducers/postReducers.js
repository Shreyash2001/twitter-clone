import {
    DELETE_POSTBYID_FAIL,
    DELETE_POSTBYID_REQUEST,
    DELETE_POSTBYID_SUCCESS,
    GET_POSTBYID_FAIL,
    GET_POSTBYID_REQUEST,
    GET_POSTBYID_SUCCESS,
    GET_USER_POST_FAIL,
    GET_USER_POST_REQUEST,
    GET_USER_POST_SUCCESS,
    USER_LIKE_POST_FAIL,
    USER_LIKE_POST_REQUEST,
    USER_LIKE_POST_SUCCESS,
    USER_POST_CREATE_FAIL,
    USER_POST_CREATE_REQUEST, 
    USER_POST_CREATE_SUCCESS,
    USER_POST_RESET,
    USER_RETWEET_POST_FAIL,
    USER_RETWEET_POST_REQUEST,
    USER_RETWEET_POST_SUCCESS,
} from "../constants/postConstants"

export const createPostReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_POST_CREATE_REQUEST:
            return {
                loading: true
            }
        case USER_POST_CREATE_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case USER_POST_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case USER_POST_RESET:
            return {}
    
        default:
            return state
    }
}

export const getPostsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_USER_POST_REQUEST:
            return {
                loading: true
            }
        case GET_USER_POST_SUCCESS:
            return {
                loading: false,
                posts: action.payload
            }
        case GET_USER_POST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
    
        default:
            return state
    }
}

export const getPostsLikeReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LIKE_POST_REQUEST:
            return {
                loading: true
            }
        case USER_LIKE_POST_SUCCESS:
            return {
                loading: false,
                likes: action.payload
            }
        case USER_LIKE_POST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
    
        default:
            return state
    }
}

export const postsRetweetReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_RETWEET_POST_REQUEST:
            return {
                loading: true
            }
        case USER_RETWEET_POST_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case USER_RETWEET_POST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
    
        default:
            return state
    }
}

export const getPostByIdReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_POSTBYID_REQUEST:
            return {
                loading: true
            }
        case GET_POSTBYID_SUCCESS:
            return {
                loading: false,
                postById: action.payload
            }
        case GET_POSTBYID_FAIL:
            return {
                loading: false,
                error: action.payload
            }
    
        default:
            return state
    }
}

export const deletePostByIdReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_POSTBYID_REQUEST:
            return {
                loading: true
            }
        case DELETE_POSTBYID_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case DELETE_POSTBYID_FAIL:
            return {
                loading: false,
                error: action.payload
            }
    
        default:
            return state
    }
}

