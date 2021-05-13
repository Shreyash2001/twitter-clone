import { Avatar, Button, CircularProgress, IconButton } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createMessage, getChatsById, getMessages, updateChatName } from '../actions/chatActions'
import "./ChatsPage.css"
import Sidebar from './Sidebar'
import AddBoxIcon from '@material-ui/icons/AddBox'
import { useHistory } from 'react-router'
import SendIcon from '@material-ui/icons/Send'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Slide from '@material-ui/core/Slide'
import EditIcon from '@material-ui/icons/Edit';



function ChatsPage() {
    const useStyles = makeStyles((theme) => ({
        modal: {
          display: 'flex',
          alignItems: 'center',
          justifyContent:"center",
          width:"90%",
          height:"400px"
        },
        paper: {
          backgroundColor: theme.palette.background.paper,
          width:"500px",
          height:"250px",
          padding: theme.spacing(2, 4, 3),
          display:"flex",
          flexDirection:"column",
        },
      }))

    const match = window.location.pathname.split("/")[2]
    const dispatch = useDispatch()
    const history = useHistory()
    const {chats, loading} = useSelector(state => state.userChatsById)
    const {messages} = useSelector(state => state.userMessages)
    const {userInfo} = useSelector(state => state.userLogin)

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const scrollRef = useRef(null)

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdateChatNameClick = () => {
        dispatch(updateChatName(match, name))
        setOpen(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(createMessage(match, message))
        setMessage("")
    }
    
    const scrollToBottom = () => {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
      
    }
    
    useEffect(() => {
        dispatch(getChatsById(match))
        dispatch(getMessages(match))
    }, [match, dispatch])

    useEffect(scrollToBottom, [messages]);


    return (
        <div className="chatsPage">
            <Sidebar />
            <div className="chatsPage__container">
            <div className="chatsPage__containerHeader">
            <div style={{marginLeft:"20px"}}>
                <h2 style={{fontWeight:"700"}}>Chat</h2>
            </div>
            <div>
                <IconButton onClick={() => history.push("/messages/new")}><AddBoxIcon style={{color:"#55acee"}} /></IconButton>
            </div>
            </div>
            <div className="chatsPage__containerAvatars">
            {loading ? <CircularProgress /> : <div style={{marginLeft:"20px", display:"flex", alignItems:"center"}}>
                {chats?.users?.map(user => ( user._id !== userInfo.id &&
                    <div className="chatsPage__containerAvatarsEach">
                    <Avatar src={user.image} alt={user.firstName} title={user.firstName} />
                    </div>
                ))}
                
                <span 
                style={{
                    marginLeft:"20px", 
                    marginRight:"20px", 
                    fontSize:"22px", 
                    color:"gray", 
                    fontWeight:"600"
                    }}>
                    {chats?.chatName !== undefined && chats?.users.length > 2 
                    ?
                     chats?.chatName 
                     :
                      chats?.users[0]._id !== userInfo?.id 
                      ?
                       chats?.users[0].firstName 
                       :
                        chats?.users[1].firstName  
                    }
                    </span>
              {chats?.isGroupChat 
              &&
              <IconButton onClick={handleOpen}>
              <EditIcon style={{color:"#55acee"}} />
              </IconButton>
              }
                
            </div>}
            </div>
            <div style={{display:"flex", flexDirection:"column", flex:"1", height:"80vh"}}>
            <div className="chatsPage__containerBody">
              
                {messages?.map(userMessage => (
                  userMessage.sender._id === userInfo?.id 
                  ?
                  
                  <li style={{listStyle:"none", display:"flex", flexDirection:"row-reverse", marginRight:"10px"}}>
                  <div className={`chatsPage__containerBodyOwnMessages`}>
                    <span>{userMessage.content}</span>
                  </div>
                  </li>
                  
                  :
                  
                  <li style={{listStyle:"none", maxWidth:"30%", width:"fit-content"}}>
                  <div style={{display:"flex", marginLeft:"16px", marginTop:"7px"}}>
                  <Avatar style={{width:"22px", height:"22px", marginRight:"10px"}} src={userMessage?.sender.image} title={userMessage?.sender.firstName} />
                  <span style={{fontSize:"16px", color:"lightgray", fontWeight:"600"}}>{userMessage?.sender.firstName}</span>
                  </div>
                  <div className={`chatsPage__containerBodyOtherMessages`}>
                    <span>{userMessage.content}</span>
                  </div>
                  </li>
                  
                ))}
                <div ref={scrollRef} />

            </div>
            <div className="chatsPage__containerMessageBox">

            <form onSubmit={handleSubmit}>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" required />
               <IconButton type="submit">
               <SendIcon style={{color:"#55acee"}} />
               </IconButton>
            </form>

            </div>
            </div>
            </div>
            <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Slide direction="down" in={open}>
          <div className={classes.paper}>
            <input 
            style={{
                outlineWidth:"0", 
                width:"450px", 
                height:"20px", 
                padding:"10px", 
                border:"1px solid lightgray", 
                borderRadius:"22px"
                }} type="text" 
                placeholder="Chat Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                />

            <Button 
            style={{
                backgroundColor:"#55acee", 
                width:"200px", 
                textTransform:"inherit", 
                color:"#fff", 
                alignSelf:"center", 
                marginTop:"20px"
                }} 
                onClick={handleUpdateChatNameClick}>
                Update Chat Name
                </Button>
          </div>
        </Slide>
      </Modal>
        </div>
    )
}

export default ChatsPage
