import { Avatar, CircularProgress, IconButton } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import "./Notification.css"
import Sidebar from './Sidebar'
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { useDispatch, useSelector } from 'react-redux'
import { getUserNotification, updateAllUserNotification, updateUserNotification } from '../actions/notificationActions'
import { Link } from 'react-router-dom'

function Notification() {
    const history = useHistory()
    const dispatch = useDispatch()

    const {notifications, loading} = useSelector(state => state.userNotifications)

    useEffect(() => {
        dispatch(getUserNotification())
    }, [dispatch])

    return (
        <div className="notification">
            <Sidebar />
            <div className="notification__container">
            <div className="notification__containerHeader">
            <div style={{marginLeft:"20px"}}>
                <h2 style={{fontWeight:"700"}}>Notifications</h2>
            </div>
            <div>
                <IconButton onClick={() => dispatch(updateAllUserNotification())}><DoneAllIcon style={{color:"#55acee"}} /></IconButton>
            </div>
            </div>

           {loading ? <CircularProgress /> :  <div className="notification__containerBody">
            {notifications?.map(notification => (
                <div onClick={() => dispatch(updateUserNotification(notification?._id))} className={`${!notification?.opened ? "notification__containerBodyInfoContainerActive" : "notification__containerBodyInfoContainer"}`}>
                {notification?.notificationType === "postLike" && 
               
                <Link to={`/post/${notification?.entityId}`}> 
                <div>
                    <Avatar src={notification?.userFrom?.image} title={notification?.userFrom?.firstName} style={{marginRight:"10px"}} />
                    <span>{notification?.userFrom?.firstName} {notification?.userFrom?.lastName} has liked your post</span>
                </div>
                </Link>
                 }
                {notification?.notificationType === "retweet" && 
               
                <Link to={`/post/${notification?.entityId}`}> 
                <div>
                    <Avatar src={notification?.userFrom?.image} title={notification?.userFrom?.firstName} style={{marginRight:"10px"}} />
                    <span>{notification?.userFrom?.firstName} {notification?.userFrom?.lastName} has retweeted your post</span>
                </div>
                </Link>
                 }
                {notification?.notificationType === "reply" && 
               
                <Link to={`/post/${notification?.entityId}`}> 
                <div>
                    <Avatar src={notification?.userFrom?.image} title={notification?.userFrom?.firstName} style={{marginRight:"10px"}} />
                    <span>{notification?.userFrom?.firstName} {notification?.userFrom?.lastName} has replied to your post</span>
                </div>
                </Link>
                 }
                {notification?.notificationType === "follow" && 
               
                <Link to={`/profile/${notification?.entityId}`}> 
                <div>
                    <Avatar src={notification?.userFrom?.image} title={notification?.userFrom?.firstName} style={{marginRight:"10px"}} />
                    <span>{notification?.userFrom?.firstName} {notification?.userFrom?.lastName} started following you</span>
                </div>
                </Link>
                 }
                </div>
                
            ))}
                
            </div>
           }
            </div>
        </div>
    )
}

export default Notification
