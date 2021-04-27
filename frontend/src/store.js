import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import { userLoginReducer, userRegisterReducer } from "./reducers/userReducers"
import { createPostReducer, getPostsReducer } from "./reducers/postReducers"

const reducer = combineReducers({
    userRegister: userRegisterReducer,
    userLogin: userLoginReducer,
    createdPost: createPostReducer,
    getAllPosts: getPostsReducer,
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