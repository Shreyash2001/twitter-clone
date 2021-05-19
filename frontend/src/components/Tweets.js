import React, {useEffect, useState } from 'react'
import "./Tweets.css"
import {useDispatch, useSelector} from "react-redux"
import {Link} from "react-router-dom"
import { getPostById, likePost, retweetPost, replyPost, deletePostById, pinPostById } from '../actions/postActions';
import { likeUserPost } from '../actions/userActions';
import { Avatar, Button, CircularProgress, IconButton, Popover } from '@material-ui/core'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import DeleteIcon from '@material-ui/icons/Delete';
import { io } from "socket.io-client";
import { TEMP_DATA_FOR_NOTIFICATION, TEMP_DATA_FOR_NOTIFICATION_RESET } from '../constants/notificationConstants';



function Tweets({postId, userId, retweetData, userImage, userName, firstName, lastName, time, replyTo, userContent, retweetUsers, likes, pinned, postData, postInfo}) {
    const useStyles = makeStyles((theme) => ({
        modal: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        paper: {
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[5],
          padding: "10px 0 10px 0"
        },
      }));
      
      
    
    const [replyContent, setReplyContent] = useState("")
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteId, setDeleteId] = useState(null)
    const classes = useStyles();

    const dispatch = useDispatch()
    const {userInfo} = useSelector(state => state.userLogin)
    const {loading} = useSelector(state => state.createdPost)
    const {loading: loadingPostById, postById} = useSelector(state => state.postByIdInfo)

    const handleReplyChange = (e) => {
        setReplyContent(e.target.value)
    }

    const handleReplyClick = (id, data) => {
        dispatch(replyPost(replyContent, id))
        setReplyContent("")
        setOpen(false);
        dispatch({type: TEMP_DATA_FOR_NOTIFICATION_RESET})
        dispatch({
          type: TEMP_DATA_FOR_NOTIFICATION,
          payload: data
        })
    }

    const handleOpen = (id) => {
        dispatch(getPostById(id))
        setOpen(true);
      };

    const handleDeleteOpen = (event, id) => {
      setAnchorEl(event.currentTarget);
      setDeleteId(id)
      };
    
      const handleDeleteClose = () => {
        setAnchorEl(null);
      };
      const openDelete = Boolean(anchorEl);
      const id = openDelete ? 'simple-popover' : undefined;

      const handleDeleteClick = (id) => {
        dispatch(deletePostById(id))
        setAnchorEl(null);
      }

      const handlePinnedClick = (id) => {
        dispatch(pinPostById(id, true))
        setAnchorEl(null);
      }
      const handleUnPinnedClick = (id) => {
        dispatch(pinPostById(id, false))
        setAnchorEl(null);
      }

      const handleClose = () => {
        setOpen(false);
      };

    function timeDifference(current, previous) {
    
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
        
        var elapsed = current - previous;
        
        if (elapsed < msPerMinute) {
            if(elapsed/1000 < 30 ){
                return "Just Now";
            } 

             return Math.round(elapsed/1000) + ' seconds ago';   
        }
        
        else if (elapsed < msPerHour) {
             return Math.round(elapsed/msPerMinute) + ' minutes ago';   
        }
        
        else if (elapsed < msPerDay ) {
             return Math.round(elapsed/msPerHour ) + ' hours ago';   
        }
    
        else if (elapsed < msPerMonth) {
             return Math.round(elapsed/msPerDay) + ' days ago';   
        }
        
        else if (elapsed < msPerYear) {
             return Math.round(elapsed/msPerMonth) + ' months ago';   
        }
        
        else {
             return Math.round(elapsed/msPerYear ) + ' years ago';   
        }
    }

    const handleLikeClick = (id, data) => {
        dispatch(likePost(id))
        dispatch(likeUserPost(id))
        dispatch({type: TEMP_DATA_FOR_NOTIFICATION_RESET})
        dispatch({
          type: TEMP_DATA_FOR_NOTIFICATION,
          payload: data
        })
    }

    const handleRetweetClick = (id, data) => {
        dispatch(retweetPost(id))
        dispatch({type: TEMP_DATA_FOR_NOTIFICATION_RESET})
        dispatch({
          type: TEMP_DATA_FOR_NOTIFICATION,
          payload: data
        })
    }
    
    return (
        <div>
            <div>
            {retweetData !== undefined ? 
            <div style={{padding:"10px 0 0px 35px"}}>
                <span style={{fontSize:"15px", color:"grey"}}>
                <RepeatIcon style={{color:"rgb(23 191 99)", fontSize:"15px"}} />Retweeted by 
                <Link className="home__containerRightTweetTextRetweetUsername" to={`/profile/${retweetData?.user?.userName}`}>
                @{retweetData?.user?.userName}
                </Link>
                </span>
            </div> : null}
            <div className="tweets__containerRightTweetsInfo">
            <div style={{paddingTop:"10px"}}>
                {userImage === "image" ? <Avatar /> : <Avatar src={userImage} />}
            </div>

            <div className="tweets__containerRightTweetsInfoContainer">
            {pinned && <div style={{display:"flex", alignItems:"center"}}>
                    <img style={{width:"18px"}} src="https://res.cloudinary.com/cqn/image/upload/v1620555492/icons8-pin-24_1_dttom0.png" alt="" />
                    <span style={{color:"gray", fontSize:"14px"}}>This is a pinned post</span>
                    </div>}
                <div className="tweets__containerRightTweetsInfoHeader">
                
                    <Link style={{color:"black", textDecoration:"none"}} to={`/profile/${userName}`}>
                    <span>{firstName} {lastName}</span>
                    </Link>
                    <div style={{display:"flex", flex:"1", justifyContent:"space-between", alignItems:"center"}}>
                    <div className="tweets__containerRightTweetsInfoHeaderNames">
                        <span>@{userName}</span>
                        <span>·</span>
                        <span>{timeDifference(new Date(), new Date(time))}</span>
                    </div>
                    
                    {userInfo && userId === userInfo.id && <div>
                    
                     <IconButton onClick={(event) => handleDeleteOpen(event, postId)}><MoreVertIcon /></IconButton>
                    </div>}
                    </div>
                </div>
                
                {replyTo !== undefined && replyTo !== null ? 
                <div style={{marginBottom:"10px", color:"grey"}}>Replying to <Link className="tweets__containerRightTweetTextRetweetUsername" to={`/profile/${replyTo?.user?.userName}`} style={{color:"#55acee"}}>@{replyTo?.user?.userName}</Link>
                </div> 
                :
                null
                }
                <Link style={{color:"black", textDecoration:"none"}} to={`/post/${postId}`}><div className="tweets__containerRightTweetsInfoBody">
                   {retweetData !== undefined ? <span>{retweetData?.content}</span> :<span>{userContent}</span>}
                </div>
                </Link>
                <div className="tweets__containerRightTweetsInfoFooter">
                    <div>
                      <IconButton onClick={() => handleOpen(postId)}>
                      <ChatBubbleOutlineIcon style={{color:"grey", fontSize:"18px"}} />
                      </IconButton>


                      {userInfo ? retweetUsers?.includes(userInfo.id) ? 
                      <IconButton className="retweet" onClick={() => handleRetweetClick(postId)}>
                      <RepeatIcon style={{color:"rgb(23 191 99)", fontSize:"18px"}} />
                      <span style={{fontSize:"16px", color:"rgb(23 191 99)"}}>{retweetUsers?.length}</span>
                      </IconButton>
                      :
                      retweetData === undefined ? <IconButton className="retweet" onClick={() => handleRetweetClick(postId, userId)}>
                      <RepeatIcon style={{color:"grey", fontSize:"18px"}} />
                      <span style={{fontSize:"16px"}}>{retweetUsers?.length}</span>
                      </IconButton> 
                      :
                      <IconButton disabled>
                      <RepeatIcon style={{color:"rgb(23 191 99)", fontSize:"18px"}} />
                      </IconButton>
                      :
                      <IconButton disabled>
                      <RepeatIcon style={{color:"grey", fontSize:"18px"}} />
                      <span style={{fontSize:"16px"}}>{retweetUsers?.length}</span>
                      </IconButton>
                      }

                      {userInfo ? likes?.includes(userInfo.id) ? 
                      <IconButton className="like" onClick={() => handleLikeClick(postId)}>
                        <FavoriteIcon style={{color:"rgb(255 82 62)", fontSize:"18px"}} />
                        <span style={{fontSize:"16px", color:"rgb(255 82 62)"}}>{likes?.length}</span>
                      </IconButton>
                      :
                      <IconButton className="like" onClick={() => handleLikeClick(postId, userId)}>
                        <FavoriteBorderIcon style={{color:"grey", fontSize:"18px"}} />
                        <span style={{fontSize:"16px"}}>{likes?.length}</span>
                      </IconButton>
                      :
                      <IconButton disabled>
                        <FavoriteBorderIcon style={{color:"grey", fontSize:"18px"}} />
                        <span style={{fontSize:"16px"}}>{likes?.length}</span>
                      </IconButton>
                      }
                    </div>
                </div>
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
        <Fade in={open}>
          <div className={classes.paper}>
          <div>
          <div style={{padding:"10px"}}>
          <div style={{borderBottom:"1px solid lightgray"}}>
          <h2 style={{margin:"0 0 10px 0"}} id="transition-modal-title">Reply</h2>
          </div>
          </div>
          </div>
          {loadingPostById ? <CircularProgress style={{color:"#55acee", width:"20px", height:"20px"}} /> 
          :
        <div>
            
            <div className="tweets__containerRightTweetsInfo">
            <div>
                {postById?.postData?.user?.image === "image" ? <Avatar /> : <Avatar src={postById?.postData?.user?.image} />}
            </div>

            <div className="tweets__containerRightTweetsInfoContainer">
            
                <div className="tweets__containerRightTweetsInfoHeader">
                    <Link style={{color:"black", textDecoration:"none"}} to={`/profile/${postById?.postData?.user?.userName}`}><span>{postById?.postData?.user?.firstName} {postById?.postData?.user?.lastName}</span></Link>
                    <div>
                        <span>@{postById?.postData?.user?.userName}</span>
                        <span>·</span>
                        <span>{timeDifference(new Date(), new Date(postById?.postData?.createdAt))}</span>
                    </div>
                </div>

                <div className="tweets__containerRightTweetsInfoBody">
                   {postById?.postData?.retweetData !== undefined ? <span>{postById?.postData?.retweetData?.content}</span> :<span>{postById?.postData?.content}</span>}
                </div>
                <div className="tweets__containerRightTweetsInfoFooter">
                    <div>
                      <IconButton onClick={() => handleOpen(postById?.postData?._id)}>
                      <ChatBubbleOutlineIcon style={{color:"grey", fontSize:"18px"}} />
                      </IconButton>


                      {userInfo ? postById?.postData?.retweetUsers?.includes(userInfo.id) ? 
                      <IconButton disabled className="retweet" onClick={() => handleRetweetClick(postById?.postData?._id)}>
                      <RepeatIcon style={{color:"rgb(23 191 99)", fontSize:"18px"}} />
                      <span style={{fontSize:"16px", color:"rgb(23 191 99)"}}>{postById?.postData?.retweetUsers?.length}</span>
                      </IconButton>
                      :
                      postById?.postData?.retweetData === undefined ? <IconButton disabled className="retweet" onClick={() => handleRetweetClick(postById?.postData?._id)}>
                      <RepeatIcon style={{color:"grey", fontSize:"18px"}} />
                      <span style={{fontSize:"16px"}}>{postById?.postData?.retweetUsers?.length}</span>
                      </IconButton> 
                      :
                      <IconButton disabled>
                      <RepeatIcon style={{color:"rgb(23 191 99)", fontSize:"18px"}} />
                      </IconButton>
                      :
                      <IconButton disabled>
                      <RepeatIcon style={{color:"grey", fontSize:"18px"}} />
                      <span style={{fontSize:"16px"}}>{postById?.postData?.retweetUsers?.length}</span>
                      </IconButton>
                      }

                      {userInfo ? postById?.postData?.likes?.includes(userInfo.id) ? 
                      <IconButton disabled className="like" onClick={() => handleLikeClick(postById?.postData?._id)}>
                        <FavoriteIcon style={{color:"rgb(255 82 62)", fontSize:"18px"}} />
                        <span style={{fontSize:"16px", color:"rgb(255 82 62)"}}>{postById?.postData?.likes?.length}</span>
                      </IconButton>
                      :
                      <IconButton disabled className="like" onClick={() => handleLikeClick(postById?.postData?._id)}>
                        <FavoriteBorderIcon style={{color:"grey", fontSize:"18px"}} />
                        <span style={{fontSize:"16px"}}>{postById?.postData?.likes?.length}</span>
                      </IconButton>
                      :
                      <IconButton disabled>
                        <FavoriteBorderIcon style={{color:"grey", fontSize:"18px"}} />
                        <span style={{fontSize:"16px"}}>{postById?.postData?.likes?.length}</span>
                      </IconButton>
                      }
                    </div>
                </div>
            </div>
        </div>

          </div>}
          <div className="tweets__containerRightTweet">
        <div>
            <Avatar src={userInfo?.image} style={{width:"50px", height:"50px"}} />
        </div>
        <div className="tweets__containerRightTweetText">
            <textarea placeholder="What's Happening" value={replyContent} onChange={handleReplyChange} />
            <div style={{display:"flex", justifyContent:"space-between"}}>
            {replyContent.length > 0 && userInfo ? <Button onClick={() => handleReplyClick(postById?.postData?._id, postById?.postData?.user?._id)}>Reply</Button> : <Button disabled>Reply</Button>}
            <div style={{marginLeft:"5%", marginTop:"5%"}}>{loading && <CircularProgress style={{color:"#55acee", width:"20px", height:"20px"}} />}</div>
            <div className="tweets__modalCloseButton">
            <Button onClick={handleClose}>Close</Button>
            </div>
            </div>
        </div>
        
        </div>
        </div>
      </Fade>
      </Modal>
            
        <Popover
        id={id}
        open={openDelete}
        anchorEl={anchorEl}
        onClose={handleDeleteClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{padding: "10px", display:"flex", flexDirection:"column"}}>
          {!pinned ? 
          <Button style={{textTransform:"inherit", backgroundColor:"#55acee", color:"#fff", width:"100px", marginBottom:"10px"}} onClick={() => handlePinnedClick(deleteId)}>
          <img style={{width:"18px"}} src="https://res.cloudinary.com/cqn/image/upload/v1620555568/icons8-pin-24_2_zada7y.png" alt="" />Pin</Button>
          :
          <Button style={{textTransform:"inherit", backgroundColor:"#55acee", color:"#fff", width:"100px", marginBottom:"10px"}} onClick={() => handleUnPinnedClick(deleteId)}>
          <img style={{width:"18px"}} src="https://res.cloudinary.com/cqn/image/upload/v1620555568/icons8-pin-24_2_zada7y.png" alt="" />Unpin</Button>
          }
          <Button style={{textTransform:"inherit", border:"1px solid red", color:"red", width:"100px"}} onClick={() => handleDeleteClick(deleteId)}><DeleteIcon /> Delete</Button>
        </div>
      </Popover>
        </div>
    )
}

export default Tweets
