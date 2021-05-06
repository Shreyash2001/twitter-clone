import {
    GET_USER_PROFILE_FAIL,
    GET_USER_PROFILE_REQUEST, 
    GET_USER_PROFILE_SUCCESS,
} from "../constants/profileConstants"

export const getUserProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_USER_PROFILE_REQUEST:
            return {
                loading: true
            }
        case GET_USER_PROFILE_SUCCESS:
            return {
                loading: false,
                profile: action.payload
            }
        case GET_USER_PROFILE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
    
        default:
            return state
    }
}