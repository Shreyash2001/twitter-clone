import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import PostById from './components/PostById';
import PostByIdReply from './components/PostByIdReply';
import Profile from './components/Profile';
import Followers from './components/Followers';
import Search from './components/Search';
import Messages from './components/Messages';
import CreateGroup from './components/CreateGroup';
import ChatsPage from './components/ChatsPage';
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Notification from './components/Notification';
import { getunreadMessage } from './actions/chatActions';
import { getLatestUnreadNotification, getUnreadNotification } from './actions/notificationActions';
import { GET_LATEST_UNREAD_NOTIFICATION_RESET, TEMP_DATA_FOR_NOTIFICATION_RESET } from './constants/notificationConstants';
import axios from 'axios';



function App() {
  const {userInfo} = useSelector(state => state.userLogin)
  const {data} = useSelector(state => state.tempData)
  const [message, setMessage] = useState(null)
  const [notifications, setNotifications] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
  var connected = false;
  var socket = io()
  if(userInfo) {
    socket.emit("setup", userInfo)
  }
  socket.on("connected", () => connected = true)
  socket.on("notification received", (newMessage) => (
    unreadMessage(newMessage)
  ))
  function unreadMessage(newMessage) {
    setMessage(newMessage)
    dispatch(getunreadMessage())
  }
  setTimeout(() => {
    setMessage(null)
  }, 6000);

  if(data) {
    socket.emit("new notification", data)
    dispatch({type: TEMP_DATA_FOR_NOTIFICATION_RESET})
  }

  socket.on("new notification", () => (
    unreadNotification()
  ))
  

  async function unreadNotification() {
    fetch("/api/notification/latest-unread", {
      headers: {
        "Authorization":`Bearer ${userInfo.token}`
      }
    }).then(res => res.json())
    .then(result => {
      setNotifications(result)
    })
    dispatch(getUnreadNotification())
  }
  if(notifications.length > 0) {
    setTimeout(() => {
      setNotifications([])
      dispatch({type: GET_LATEST_UNREAD_NOTIFICATION_RESET})
    }, 6000);
  }
  
  }, [userInfo, message, data, dispatch, notifications])

  

  return (
    <div className="app">
      <Router>
      <Switch>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/notification">
        <Notification />
      </Route>
      <Route path="/search">
        <Search messageNotification={message} />
      </Route>
      <Route path="/messages/new">
        <CreateGroup />
      </Route>
      <Route path="/messages/:id">
        <ChatsPage />
      </Route>
      <Route path="/messages">
        <Messages />
      </Route>
      <Route path="/profile/:id/followers">
        <Followers />
      </Route>
      <Route path="/profile/:id">
        <Profile messageNotification={message} latestNotifications={notifications} />
      </Route>
      <Route path="/profile">
        <Profile messageNotification={message} latestNotifications={notifications} />
      </Route>
      <Route path="/post/reply/:id">
        <PostByIdReply />
      </Route>
      <Route path="/post/:id">
        <PostById messageNotification={message} latestNotifications={notifications} />
      </Route>
      <Route path="/">
        <Home messageNotification={message} latestNotifications={notifications} />
      </Route>
      </Switch>
      </Router>
    </div>
  );
}

export default App;
