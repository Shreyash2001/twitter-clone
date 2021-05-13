import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import "./Messages.css"
import {Link} from "react-router-dom"
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Avatar, CircularProgress, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router';
import { getChats } from '../actions/chatActions';
import { useDispatch, useSelector } from 'react-redux';


function Messages() { 
    const history = useHistory()
    const dispatch = useDispatch()
    const {userInfo} = useSelector(state => state.userLogin)
    const {chats, loading} = useSelector(state => state.userChats)

    useEffect(() => {
        dispatch(getChats())
    }, [dispatch])

    return (
        <div className="messages">
            <Sidebar />
            <div className="messages__container">
            <div className="messages__containerHeader">
            <div style={{marginLeft:"20px"}}>
                <h1 style={{fontWeight:"700"}}>Inbox</h1>
            </div>
            <div>
                <IconButton onClick={() => history.push("/messages/new")}><AddBoxIcon style={{color:"#55acee"}} /></IconButton>
            </div>
            </div>
          {loading 
          ? 
          <CircularProgress /> 
          :   
          <div>
            {chats?.map(chat => (
                <>
                
             <Link style={{color:"black", textDecoration:"none", cursor:"pointer"}} to={`/messages/${chat._id}`}>  
              <div className="messages__containerInfo">
              <div className="messages__containerInfoHeaders">
                <div className="messages__containerInfoAvatars">
                
                    {chat?.users?.map(user => ( user._id !== userInfo?.id &&
                        
                        <div>
                        <Avatar src={user.image} style={{width:"40px", height:"40px", marginLeft:"-10px"}} title={user?.firstName} />
                        </div>
                    ))}
                    </div>

                    <div>
                    {chat?.chatName === undefined 
                    ? 
                    <div style={{display:"flex"}}>{chat?.users?.map(user => ( user._id !== userInfo?.id 
                    &&
                        <div className="messages__containerInfoNames">                      
                        <span style={{fontSize:"18px", fontWeight:"500"}} title={user?.firstName}>{user.firstName} {user.lastName}</span><span>{" · "}</span>                   
                        </div>
                    )) }</div>
                    :
                     <span style={{fontSize:"18px", fontWeight:"500"}} title={chat?.chatName}>{chat?.chatName}</span>
                    }
                    <div className="messages__containerInfoNames">
                    <span style={{fontSize:"14px", color:"darkgray"}} title={chat?.latestMessage?.content} >{chat?.latestMessage?.content}</span>
                    </div>
                    
                    </div>
                    </div>

                </div>
                </Link>
                </>
            ))}
                
            </div>}
            </div>
        </div>
    )
}

export default Messages
