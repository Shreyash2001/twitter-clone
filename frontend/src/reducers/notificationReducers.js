import { GET_LATEST_UNREAD_NOTIFICATION_FAIL, GET_LATEST_UNREAD_NOTIFICATION_REQUEST, GET_LATEST_UNREAD_NOTIFICATION_RESET, GET_LATEST_UNREAD_NOTIFICATION_SUCCESS, GET_NOTIFICATION_FAIL, GET_NOTIFICATION_REQUEST, GET_NOTIFICATION_SUCCESS, GET_UNREAD_NOTIFICATION_FAIL, GET_UNREAD_NOTIFICATION_REQUEST, GET_UNREAD_NOTIFICATION_SUCCESS, TEMP_DATA_FOR_NOTIFICATION, TEMP_DATA_FOR_NOTIFICATION_RESET } from "../constants/notificationConstants";

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

export const getLatestUnreadNotificationReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_LATEST_UNREAD_NOTIFICATION_REQUEST:
            return {
                loading: true
            }
        case GET_LATEST_UNREAD_NOTIFICATION_SUCCESS:
            return {
                loading: false,
                latestUnreadNotifications: action.payload
            }
        case GET_LATEST_UNREAD_NOTIFICATION_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case GET_LATEST_UNREAD_NOTIFICATION_RESET:
            return {}
    
        default:
            return state
    }
}

export const tempDataForNotificationReducer = (state = {}, action) => {
    switch (action.type) {
        case TEMP_DATA_FOR_NOTIFICATION:
            return {
                data: action.payload
            }
        case TEMP_DATA_FOR_NOTIFICATION_RESET:
            return {}
    
        default:
            return state
    }
}