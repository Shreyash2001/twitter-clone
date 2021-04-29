import {
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

