import { 
    USER_FOLLOWERS_FOLLOWING_FAIL,
    USER_FOLLOWERS_FOLLOWING_REQUEST,
    USER_FOLLOWERS_FOLLOWING_SUCCESS,
    USER_LIKED_FAIL,
    USER_LIKED_REQUEST,
    USER_LIKED_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS
 } from "../constants/userConstants";

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
        return {
            loading: true
        }
        case USER_REGISTER_SUCCESS:
        return {
            loading: false,
            success:true,
            userInfo: action.payload
        }
        case USER_REGISTER_FAIL:
        return {
            loading: false,
            error: action.payload
        }
    
        default:
            return state
    }
}

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
        return {
            loading: true
        }
        case USER_LOGIN_SUCCESS:
        return {
            loading: false,
            success:true,
            userInfo: action.payload
        }
        case USER_LOGIN_FAIL:
        return {
            loading: false,
            error: action.payload
        }
        case USER_LOGOUT:
        return {}
    
        default:
            return state
    }
}

export const userLikedReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LIKED_REQUEST:
        return {
            loading: true
        }
        case USER_LIKED_SUCCESS:
        return {
            loading: false,
            success:true,
        }
        case USER_LIKED_FAIL:
        return {
            loading: false,
            error: action.payload
        }
    
        default:
            return state
    }
}

export const usersFollowFollowingInfoReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_FOLLOWERS_FOLLOWING_REQUEST:
        return {
            loading: true
        }
        case USER_FOLLOWERS_FOLLOWING_SUCCESS:
        return {
            loading: false,
            userInfo: action.payload
        }
        case USER_FOLLOWERS_FOLLOWING_FAIL:
        return {
            loading: false,
            error: action.payload
        }
    
        default:
            return state
    }
}