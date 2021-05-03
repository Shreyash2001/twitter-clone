import React from 'react'
import {useDispatch, useSelector} from "react-redux"
import { userLogout } from '../actions/userActions'
import { useHistory } from 'react-router';
import "./Sidebar.css"
import { IconButton } from '@material-ui/core';

function Sidebar() {

    const {userInfo} = useSelector(state => state.userLogin)
    const history = useHistory()
    const dispatch = useDispatch()

    return (
        <div>
            <div className="home__containerLeft">
        <div style={{marginBottom:"10px"}}>
        <IconButton onClick={() => history.push("/")}><img src="https://img.icons8.com/fluent/48/000000/twitter.png" alt="twitter" /></IconButton>
        </div>
        <div className="home__icons">
            <img style={{width:"35px"}} src="https://img.icons8.com/ios/32/000000/home--v1.png" alt="" />
            <h3>Home</h3>
        </div>
        <div className="home__icons">
            <img style={{width:"35px"}} src="https://img.icons8.com/ios/48/000000/appointment-reminders--v1.png" alt="" />
            <h3>Notifications</h3>
        </div>
        <div className="home__icons">
            <img style={{width:"35px"}} src="https://img.icons8.com/ios/48/000000/important-mail.png" alt="" />
            <h3>Messages</h3>
        </div>
        {userInfo && <div className="home__icons">
            <img style={{width:"35px"}} src="https://img.icons8.com/fluent-systems-regular/48/000000/user-male-circle.png" alt="" />
            <h3>Profile</h3>
        </div>}
        {userInfo ? <div className="home__icons" onClick={() => dispatch(userLogout())}>
            <img style={{width:"35px"}} src="https://img.icons8.com/ios/50/000000/logout-rounded-left.png" alt="" />
            <h3>Logout</h3>
        </div> : 
        <div className="home__icons" onClick={() => history.push("/login")}>
            <img style={{width:"35px"}} src="https://img.icons8.com/ios/50/000000/login-rounded-right--v1.png" alt="" />
            <h3>Login</h3>
        </div>
        }
        </div>

        </div>
    )
}

export default Sidebar
