import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import { userLoginReducer, userRegisterReducer, usersFollowFollowingInfoReducer, usersSearchReducer } from "./reducers/userReducers"
import { createPostReducer, getPostByIdReducer, getPostsLikeReducer, getPostsReducer, postsSearchReducer } from "./reducers/postReducers"
import { getUserProfileFollowersReducer, getUserProfileReducer } from "./reducers/profileReducers"
import { createChatReducer, getChatsByIdReducer, getChatsReducer, getMessagesReducer, getUnreadMessagesReducer } from "./reducers/chatReducers"
import { getLatestUnreadNotificationReducer, getNotificationReducer, getUnreadNotificationReducer, tempDataForNotificationReducer } from "./reducers/notificationReducers"

const reducer = combineReducers({
    userRegister: userRegisterReducer,
    userLogin: userLoginReducer,
    userProfile: getUserProfileReducer,
    usersFollowers: getUserProfileFollowersReducer, 
    userLoggedInFollowers: usersFollowFollowingInfoReducer,
    searchedUsers: usersSearchReducer,
    createdPost: createPostReducer,
    getAllPosts: getPostsReducer,
    getLikes: getPostsLikeReducer,
    postByIdInfo: getPostByIdReducer,
    searchedPosts: postsSearchReducer,
    chatsInfo: createChatReducer,
    userChats: getChatsReducer,
    userChatsById: getChatsByIdReducer,
    userMessages: getMessagesReducer,
    userUnreadMessages: getUnreadMessagesReducer,
    userNotifications: getNotificationReducer,
    userUnreadNotifications: getUnreadNotificationReducer,
    userLatestUnreadNotifications: getLatestUnreadNotificationReducer,
    tempData: tempDataForNotificationReducer,
})

const userInfoFromStorage = localStorage.getItem("Twitter-UserInfo") ? JSON.parse(localStorage.getItem("Twitter-UserInfo")) : null

const initialState = {
    userLogin: {userInfo: userInfoFromStorage}
}

const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store