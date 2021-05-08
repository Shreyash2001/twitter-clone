import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import PostById from './components/PostById';
import PostByIdReply from './components/PostByIdReply';
import Profile from './components/Profile';
import Followers from './components/Followers';
import Following from './components/Following';


function App() {
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
      <Route path="/profile/:id/following">
        <Followers />
      </Route>
      <Route path="/profile/:id/followers">
        <Followers />
      </Route>
      <Route path="/profile/:id">
        <Profile />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/post/reply/:id">
        <PostByIdReply />
      </Route>
      <Route path="/post/:id">
        <PostById />
      </Route>
      <Route path="/">
        <Home />
      </Route>
      </Switch>
      </Router>
    </div>
  );
}

export default App;
