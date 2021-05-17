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
import { Avatar } from '@material-ui/core';
import { getunreadMessage } from './actions/chatActions';


function App() {
  const {userInfo} = useSelector(state => state.userLogin)
  const [message, setMessage] = useState(null)
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
  }, [userInfo, message, dispatch])

  

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
        <Profile />
      </Route>
      <Route path="/profile">
        <Profile messageNotification={message} />
      </Route>
      <Route path="/post/reply/:id">
        <PostByIdReply />
      </Route>
      <Route path="/post/:id">
        <PostById messageNotification={message} />
      </Route>
      <Route path="/">
        <Home messageNotification={message} />
      </Route>
      </Switch>
      </Router>
    </div>
  );
}

export default App;
