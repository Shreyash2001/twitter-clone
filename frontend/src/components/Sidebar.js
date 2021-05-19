import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import { userLogout } from '../actions/userActions'
import { useHistory } from 'react-router';
import "./Sidebar.css"
import { Avatar, Button, IconButton } from '@material-ui/core';
import { getunreadMessage } from '../actions/chatActions';
import { getUnreadNotification } from '../actions/notificationActions';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

function Sidebar() {
    const useStyles = makeStyles((theme) => ({
        typography: {
          padding: theme.spacing(2),
          width:"300px",
          height:"150px"
        },
      }));
      const classes = useStyles();
      const [anchorEl, setAnchorEl] = useState(null);
    
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

      const handleLogoutClick = () => {
        dispatch(userLogout())
        setAnchorEl(null);
      }
    
      const open = Boolean(anchorEl);
      const id = open ? 'simple-popover' : undefined;      

    const {userInfo} = useSelector(state => state.userLogin)
    const {unreadMessages} = useSelector(state => state.userUnreadMessages)
    const {unreadNotifications} = useSelector(state => state.userUnreadNotifications)
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getunreadMessage())
        dispatch(getUnreadNotification())
    }, [dispatch])

    return (
        <div>
            <div className="home__containerLeft">
        <div style={{marginBottom:"10px"}}>
        <IconButton onClick={() => history.push("/")}><img src="https://img.icons8.com/fluent/48/000000/twitter.png" alt="twitter" /></IconButton>
        </div>
        <div>
        <Button className="button" onClick={() => history.push("/")}>
            <HomeRoundedIcon style={{fontSize:"35px"}} />
            <h3 style={{marginLeft:"10px", fontSize:"20px"}}>Home</h3>
        </Button>
        
       {userInfo && <Button className="button" onClick={() => history.push("/notification")}>
        <div style={{position:"relative"}}>
            <NotificationsRoundedIcon style={{fontSize:"35px"}} />
            {unreadNotifications?.length > 0 
            && 
            <div style=
            {{backgroundColor:"rgb(255, 82, 62)", 
              borderRadius:"50%", 
              width:"30px", 
              height:"30px", 
              position:"absolute", 
              top:"-18px", 
              left:"20px"
              }}>
            <span style={{color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", padding:"7px"}}>
            {unreadNotifications?.length > 0 && unreadNotifications.length}
            </span>
            </div>}
            </div>
            <h3 style={{marginLeft:"10px", fontSize:"20px"}}>Notifications</h3>
        
        </Button>}

      {userInfo &&   <Button className="button" onClick={() => history.push("/messages")}>
        <div style={{position:"relative"}}>
            <EmailRoundedIcon style={{fontSize:"35px"}} />
            {unreadMessages?.length > 0 
            && 
            <div style=
            {{backgroundColor:"rgb(255, 82, 62)", 
              borderRadius:"50%", 
              width:"30px", 
              height:"30px", 
              position:"absolute", 
              top:"-18px", 
              left:"20px"
              }}>
            <span style={{color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", padding:"7px"}}>
            {unreadMessages?.length > 0 && unreadMessages.length}
            </span>
            </div>}
        </div>
            <h3 style={{marginLeft:"10px", fontSize:"20px"}}>Messages</h3>
        </Button>}

        {userInfo && 
        <Button className="button" onClick={() => history.push("/profile")}>
            <AccountCircleRoundedIcon style={{fontSize:"35px"}} />
            <h3 style={{marginLeft:"10px", fontSize:"20px"}}>Profile</h3>
        </Button>}

        {userInfo && 
        <Button className="button" onClick={() => history.push("/search")}>
            <SearchRoundedIcon style={{fontSize:"35px"}} />
            <h3 style={{marginLeft:"10px", fontSize:"20px"}}>Search</h3>
        </Button>}
        </div>
        
        <div style={{position:"absolute", bottom:"30px", right:"30px"}}>
        {userInfo ? 
            <div>
            <Button style={{textTransform:"inherit", borderRadius:"50px", padding:"8px 12px", maxWidth:"600px", minWidth:"300px"}} onClick={handleClick}>
            <div style={{display:"flex", alignItems:"center", width:"100%"}}>
            <div style={{display:"flex", alignItems:"center"}}>
                <div style={{marginRight:"20px"}}>
                    <Avatar style={{width:"50px", height:"50px"}} src={userInfo?.image} title={userInfo?.firstName} />
                </div>
                <div style={{display:"flex", flexWrap:"wrap"}}>
                    <span style={{fontSize:"20px", fontWeight:"700", marginRight:"20px"}}>{userInfo?.firstName} {userInfo?.lastName}</span>
                    <span style={{color:"darkgray", fontSize:"16px"}}>@{userInfo?.userName}</span>
                </div>

                </div>
                
                <div style={{marginLeft:"30px"}}>
                <MoreHorizIcon />
                </div>
            </div>
            </Button>
            </div> 
            : 
            <div style={{
                width:"100vw", 
                backgroundColor:"#55acee", 
                height:"100px", 
                position:"absolute",
                bottom:"-30px",
                left:"-370px",
                display:"flex",
                justifyContent:"center",
                zIndex:"100"}}>
                <div style={{display:"flex"}}>
                <div style={{display:"flex", flexDirection:"column", padding:"10px", marginRight:"200px"}}>
                <span style={{fontSize:"32px", color:"#fff", marginBottom:"10px"}}>Don’t miss what’s happening</span>
                <span style={{fontSize:"20px", color:"#fff"}}>People on Twitter are the first to know.</span>
                </div>
                <div>
                    <Button style={{
                        width:"150px",
                        textTransform:"inherit", 
                        border:"1px solid #fff", 
                        borderRadius:"22px",
                        height:"40px", 
                        marginTop:"20px", 
                        color:"#fff"}} onClick={() => history.push("/login")}>Login</Button>
                    <Button  style={{
                        width:"150px",
                        textTransform:"inherit", 
                        backgroundColor:"#fff", 
                        borderRadius:"22px",
                        marginLeft:"20px",
                        height:"40px", 
                        marginTop:"20px", 
                        color:"#55acee"}} onClick={() => history.push("/register")}>Signup</Button>
                </div>
                </div>
            </div>

        }
        </div>
        
        </div>
        <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className={classes.typography}>
            <div>
                <div style={{display:"flex", alignItems:"center"}}>
                    <div style={{marginRight:"20px"}}>
                        <Avatar src={userInfo?.image} title={userInfo?.firstName} />
                    </div>
                    <div style={{display:"flex", flexDirection:"column"}}>
                        <span style={{fontSize:"24px", fontWeight:"700"}}>{userInfo?.firstName} {userInfo?.lastName}</span>
                        <span style={{color:"darkgray"}}>@{userInfo?.userName}</span>
                    </div>
                </div>
                <hr style={{border:"none", height:"1px", backgroundColor:"lightgray"}} />
                <div>
                    <Button style={{
                        width:"300px", 
                        textTransform:"inherit", 
                        backgroundColor:"rgb(255 82 62)", 
                        height:"40px", 
                        marginTop:"20px", 
                        color:"#fff"
                        }} onClick={handleLogoutClick}>Logout of @{userInfo?.userName}</Button>
                </div>
            </div>
        </Typography>
      </Popover>
        </div>
    )
}

export default Sidebar
