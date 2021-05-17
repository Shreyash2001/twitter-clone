import { CREATE_CHAT_FAIL, CREATE_CHAT_REQUEST, CREATE_CHAT_SUCCESS, GET_CHATSBYID_FAIL, GET_CHATSBYID_REQUEST, GET_CHATSBYID_SUCCESS, GET_CHAT_FAIL, GET_CHAT_REQUEST, GET_CHAT_SUCCESS, GET_MESSAGE_FAIL, GET_MESSAGE_REQUEST, GET_MESSAGE_SUCCESS, GET_UNREAD_MESSAGE_FAIL, GET_UNREAD_MESSAGE_REQUEST, GET_UNREAD_MESSAGE_SUCCESS } from "../constants/chatConstants";

export const createChatReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_CHAT_REQUEST:
            return {
                loading: true
            }
        case CREATE_CHAT_SUCCESS:
            return {
                loading: false,
                success: true,
                chat: action.payload
            }
        case CREATE_CHAT_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        
    
        default:
            return state
    }
}

export const getChatsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_CHAT_REQUEST:
            return {
                loading: true
            }
        case GET_CHAT_SUCCESS:
            return {
                loading: false,
                chats: action.payload
            }
        case GET_CHAT_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        
    
        default:
            return state
    }
}

export const getChatsByIdReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_CHATSBYID_REQUEST:
            return {
                loading: true
            }
        case GET_CHATSBYID_SUCCESS:
            return {
                loading: false,
                chats: action.payload
            }
        case GET_CHATSBYID_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        
    
        default:
            return state
    }
}

export const getMessagesReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_MESSAGE_REQUEST:
            return {
                loading: true
            }
        case GET_MESSAGE_SUCCESS:
            return {
                loading: false,
                messages: action.payload
            }
        case GET_MESSAGE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        
    
        default:
            return state
    }
}

export const getUnreadMessagesReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_UNREAD_MESSAGE_REQUEST:
            return {
                loading: true
            }
        case GET_UNREAD_MESSAGE_SUCCESS:
            return {
                loading: false,
                unreadMessages: action.payload
            }
        case GET_UNREAD_MESSAGE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        
    
        default:
            return state
    }
}