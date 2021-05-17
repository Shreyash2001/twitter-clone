import { GET_NOTIFICATION_FAIL, GET_NOTIFICATION_REQUEST, GET_NOTIFICATION_SUCCESS, GET_UNREAD_NOTIFICATION_FAIL, GET_UNREAD_NOTIFICATION_REQUEST, GET_UNREAD_NOTIFICATION_SUCCESS } from "../constants/notificationConstants";

export const getNotificationReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_NOTIFICATION_REQUEST:
            return {
                loading: true
            }
        case GET_NOTIFICATION_SUCCESS:
            return {
                loading: false,
                notifications: action.payload
            }
        case GET_NOTIFICATION_FAIL:
            return {
                loading: false,
                error: action.payload
            }
    
        default:
            return state
    }
}

export const getUnreadNotificationReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_UNREAD_NOTIFICATION_REQUEST:
            return {
                loading: true
            }
        case GET_UNREAD_NOTIFICATION_SUCCESS:
            return {
                loading: false,
                unreadNotifications: action.payload
            }
        case GET_UNREAD_NOTIFICATION_FAIL:
            return {
                loading: false,
                error: action.payload
            }
    
        default:
            return state
    }
}