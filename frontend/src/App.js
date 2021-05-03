import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import PostById from './components/PostById';
import PostByIdReply from './components/PostByIdReply';


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
