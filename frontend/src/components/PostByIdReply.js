import { Avatar, Button, CircularProgress, IconButton } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Link, useHistory} from "react-router-dom"
import "./PostById.css"
import Sidebar from './Sidebar'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { getPostById, getPosts, likePost, replyPost, retweetPost } from '../actions/postActions';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { likeUserPost } from '../actions/userActions'
import { makeStyles } from '@material-ui/core/styles';

function PostByIdReply() {

  var match = window.location.pathname.split("/")[3]

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
      
    
    const history = useHistory()
    const dispatch = useDispatch()
    const {userInfo} = useSelector(state => state.userLogin)
    const {loading: loadingPostById, postById} = useSelector(state => state.postByIdInfo)
   
    const [replyContent, setReplyContent] = useState("")
    const [open, setOpen] = useState(false);
    const classes = useStyles();


    const handleReplyChange = (e) => {
        setReplyContent(e.target.value)
    }

    const handleReplyClick = (id) => {
        dispatch(replyPost(replyContent, id))
        setReplyContent("")
        setOpen(false);
    }

    const handleOpen = (id) => {
        setOpen(true);
      };
    
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

    const handleLikeClick = (id) => {
        dispatch(likePost(id))
        dispatch(likeUserPost(id))
        dispatch(getPostById(match))
    }

    const handleRetweetClick = (id) => {
        dispatch(retweetPost(id))
        dispatch(getPostById(match))
    }

    useEffect(() => {
        dispatch(getPostById(match))
        dispatch(getPosts())
        
    }, [dispatch, match])

    return (
        <div className="postById">
            <Sidebar />

        <div className="postById__containerRight">
        <div className="postById__containerRightHeader">
            <IconButton onClick={() => history.push("/")}><ArrowBackIcon /></IconButton>
            <h2>Tweet</h2>
        </div>

        {loadingPostById ? <CircularProgress style={{color:"#55acee", width:"20px", height:"20px"}} /> 
        :
         <div>

            <>
            
          {postById?.postData?.replyTo !== undefined ?   <div className="postById__containerRightTweetsInfo">
            <div>
                {postById?.postData?.replyTo?.user?.image === "image" ? <Avatar /> : <Avatar src={postById?.postData?.replyTo?.user?.image} />}
            </div>

            <div className="postById__containerRightTweetsInfoContainer">
                <div className="postById__containerRightTweetsInfoHeader">
                    <Link style={{color:"black", textDecoration:"none"}} to={`/profile/${postById?.postData?.replyTo?.user?._id}`}><span>{postById?.postData?.replyTo?.user?.firstName} {postById?.postData?.replyTo?.user?.lastName}</span></Link>
                    <div>
                        <span>@{postById?.postData?.replyTo?.user?.userName}</span>
                        <span>·</span>
                        <span>{timeDifference(new Date(), new Date(postById?.postData?.replyTo?.createdAt))}</span>
                    </div>
                </div>
                <Link style={{color:"black", textDecoration:"none"}} to={`/post/${postById?.postData?._id}`}><div className="postById__containerRightTweetsInfoBody">
                   {postById?.postData?.replyTo?.retweetData !== undefined ? <span>{postById?.postData?.replyTo?.retweetData?.content}</span> :<span>{postById?.postData?.replyTo?.content}</span>}
                </div></Link>
                <div className="postById__containerRightTweetsInfoFooter">
                    <div>
                      {userInfo ? <IconButton onClick={() => handleOpen(postById?.postData?.replyTo?._id)}>
                      <ChatBubbleOutlineIcon style={{color:"grey", fontSize:"18px"}} />
                      </IconButton>
                      :
                      <IconButton disabled onClick={() => handleOpen(postById?.postData?.replyTo?._id)}>
                      <ChatBubbleOutlineIcon style={{color:"grey", fontSize:"18px"}} />
                      </IconButton>
                      }


                      {userInfo ? postById?.postData?.replyTo?.retweetUsers?.includes(userInfo.id) ? 
                      <IconButton className="retweet" onClick={() => handleRetweetClick(postById?.postData?.replyTo?._id)}>
                      <RepeatIcon style={{color:"rgb(23 191 99)", fontSize:"18px"}} />
                      <span style={{fontSize:"16px", color:"rgb(23 191 99)"}}>{postById?.postData?.replyTo?.retweetUsers?.length}</span>
                      </IconButton>
                      :
                      postById?.postData?.replyTo?.retweetData === undefined ? <IconButton className="retweet" onClick={() => handleRetweetClick(postById?.postData?.replyTo?._id)}>
                      <RepeatIcon style={{color:"grey", fontSize:"18px"}} />
                      <span style={{fontSize:"16px"}}>{postById?.postData?.replyTo?.retweetUsers?.length}</span>
                      </IconButton> 
                      :
                      <IconButton>
                      <RepeatIcon style={{color:"rgb(23 191 99)", fontSize:"18px"}} />
                      </IconButton>
                      :
                      <IconButton disabled>
                      <RepeatIcon style={{color:"grey", fontSize:"18px"}} />
                      <span style={{fontSize:"16px"}}>{postById?.postData?.replyTo?.retweetUsers?.length}</span>
                      </IconButton>
                      }

                      {userInfo ? postById?.postData?.replyTo?.likes?.includes(userInfo.id) ? 
                      <IconButton className="like" onClick={() => handleLikeClick(postById?.postData?.replyTo?._id)}>
                        <FavoriteIcon style={{color:"rgb(255 82 62)", fontSize:"18px"}} />
                        <span style={{fontSize:"16px", color:"rgb(255 82 62)"}}>{postById?.postData?.replyTo?.likes?.length}</span>
                      </IconButton>
                      :
                      <IconButton className="like" onClick={() => handleLikeClick(postById?.postData?.replyTo?._id)}>
                        <FavoriteBorderIcon style={{color:"grey", fontSize:"18px"}} />
                        <span style={{fontSize:"16px"}}>{postById?.postData?.replyTo?.likes?.length}</span>
                      </IconButton>
                      :
                      <IconButton disabled>
                        <FavoriteBorderIcon style={{color:"grey", fontSize:"18px"}} />
                        <span style={{fontSize:"16px"}}>{postById?.postData?.replyTo?.likes?.length}</span>
                      </IconButton>
                      }
                    </div>
                </div>
            </div>
        </div> : null}

            <div className="postById__containerRightTweetsInfo">
            <div>
                {postById?.postData?.user?.image === "image" ? <Avatar /> : <Avatar src={postById?.postData?.user?.image} />}
            </div>

            <div className="postById__containerRightTweetsInfoContainer">
                <div className="postById__containerRightTweetsInfoHeader">
                    <Link style={{color:"black", textDecoration:"none"}} to={`/profile/${postById?.postData?.user?._id}`}><span>{postById?.postData?.user?.firstName} {postById?.postData?.user?.lastName}</span></Link>
                    <div>
                        <span>@{postById?.postData?.user?.userName}</span>
                        <span>·</span>
                        <span>{timeDifference(new Date(), new Date(postById?.postData?.createdAt))}</span>
                    </div>
                </div>
                <div className="postById__containerRightTweetsInfoBody">
                   {postById?.postData?.retweetData !== undefined ? <span style={{fontSize:"30px"}}>{postById?.postData?.retweetData?.content}</span> :<span style={{fontSize:"30px"}}>{postById?.postData?.content}</span>}
                </div>
                <div className="postById__containerRightTweetsInfoFooter">
                    <div>
                      <IconButton disabled onClick={() => handleOpen(postById?.postData?._id)}>
                      <ChatBubbleOutlineIcon style={{color:"grey", fontSize:"18px"}} />
                      </IconButton>


                      {userInfo ? postById?.postData?.retweetUsers?.includes(userInfo.id) ? 
                      <IconButton disabled className="retweet" onClick={() => handleRetweetClick(postById?.postData?._id)}>
                      <RepeatIcon style={{color:"rgb(23 191 99)", fontSize:"18px"}} />
                      <span style={{fontSize:"16px", color:"rgb(23 191 99)"}}>{postById?.postData?.retweetUsers?.length}</span>
                      </IconButton>
                      :
                      postById?.postData?.retweetData === undefined ? <IconButton disabled className="retweet" onClick={() => handleRetweetClick(postById._id)}>
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
            </>
          </div>}
          <div>
          {postById?.replies?.map(post => (
            
            <>
            {post.retweetData !== undefined ? 
            <div key={post?._id} style={{padding:"10px 0 6px 35px"}}>
                <span style={{fontSize:"15px", color:"grey"}}>
                <RepeatIcon style={{color:"rgb(23 191 99)", fontSize:"15px"}} />Retweeted by <Link className="home__containerRightTweetTextRetweetUsername" to={`/profile/${post?.retweetData?.user?._id}`}>@{post?.retweetData?.user?.userName}</Link>
                </span>
            </div> : null}
            <div className="home__containerRightTweetsInfo">
            <div>
                {post.user?.image === "image" ? <Avatar /> : <Avatar src={post.user?.image} />}
            </div>

            <div className="home__containerRightTweetsInfoContainer">
                <div className="home__containerRightTweetsInfoHeader">
                    <Link style={{color:"black", textDecoration:"none"}} to={`/profile/${post.user?._id}`}><span>{post.user?.firstName} {post.user?.lastName}</span></Link>
                    <div>
                        <span>@{post.user?.userName}</span>
                        <span>·</span>
                        <span>{timeDifference(new Date(), new Date(post?.createdAt))}</span>
                    </div>
                </div>
                {post.replyTo !== undefined ? <div style={{marginBottom:"10px", color:"grey"}}>Replying to <Link className="home__containerRightTweetTextRetweetUsername" to={`/profile/${post.replyTo?.user?._id}`} style={{color:"#55acee"}}>@{post.replyTo?.user?.userName}</Link></div> :null}
                <Link style={{color:"black", textDecoration:"none"}} to={`/post/reply/${post?._id}`}><div className="home__containerRightTweetsInfoBody">
                   {post.retweetData !== undefined ? <span>{post.retweetData?.content}</span> :<span>{post.content}</span>}
                </div>
                </Link>
                <div className="home__containerRightTweetsInfoFooter">
                    <div>
                      <IconButton onClick={() => handleOpen(post?._id)}>
                      <ChatBubbleOutlineIcon style={{color:"grey", fontSize:"18px"}} />
                      </IconButton>


                      {userInfo ? post?.retweetUsers?.includes(userInfo.id) ? 
                      <IconButton className="retweet" onClick={() => handleRetweetClick(post._id)}>
                      <RepeatIcon style={{color:"rgb(23 191 99)", fontSize:"18px"}} />
                      <span style={{fontSize:"16px", color:"rgb(23 191 99)"}}>{post?.retweetUsers?.length}</span>
                      </IconButton>
                      :
                      post?.retweetData === undefined ? <IconButton className="retweet" onClick={() => handleRetweetClick(post._id)}>
                      <RepeatIcon style={{color:"grey", fontSize:"18px"}} />
                      <span style={{fontSize:"16px"}}>{post?.retweetUsers?.length}</span>
                      </IconButton> 
                      :
                      <IconButton disabled>
                      <RepeatIcon style={{color:"rgb(23 191 99)", fontSize:"18px"}} />
                      </IconButton>
                      :
                      <IconButton disabled>
                      <RepeatIcon style={{color:"grey", fontSize:"18px"}} />
                      <span style={{fontSize:"16px"}}>{post?.retweetUsers?.length}</span>
                      </IconButton>
                      }

                      {userInfo ? post?.likes?.includes(userInfo.id) ? 
                      <IconButton className="like" onClick={() => handleLikeClick(post._id)}>
                        <FavoriteIcon style={{color:"rgb(255 82 62)", fontSize:"18px"}} />
                        <span style={{fontSize:"16px", color:"rgb(255 82 62)"}}>{post?.likes?.length}</span>
                      </IconButton>
                      :
                      <IconButton className="like" onClick={() => handleLikeClick(post._id)}>
                        <FavoriteBorderIcon style={{color:"grey", fontSize:"18px"}} />
                        <span style={{fontSize:"16px"}}>{post?.likes?.length}</span>
                      </IconButton>
                      :
                      <IconButton disabled>
                        <FavoriteBorderIcon style={{color:"grey", fontSize:"18px"}} />
                        <span style={{fontSize:"16px"}}>{post?.likes?.length}</span>
                      </IconButton>
                      }
                    </div>
                </div>
            </div>
        </div>
            </>
        ))}

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
          <div style={{padding:"10px"}}>
          <div style={{borderBottom:"1px solid lightgray"}}>
          <h2 style={{margin:"0 0 10px 0"}} id="transition-modal-title">Reply</h2>
          </div>
        {loadingPostById ? <CircularProgress style={{color:"#55acee", width:"20px", height:"20px"}} /> 
        :
         <div>

            <>
            
            <div className="postById__containerRightTweetsInfo">
            <div>
                {postById?.postData?.user?.image === "image" ? <Avatar /> : <Avatar src={postById?.postData?.user?.image} />}
            </div>

            <div className="postById__containerRightTweetsInfoContainer">
                <div className="postById__containerRightTweetsInfoHeader">
                    <Link style={{color:"black", textDecoration:"none"}} to={`/profile/${postById?.postData?.user?._id}`}><span>{postById?.postData?.user?.firstName} {postById?.postData?.user?.lastName}</span></Link>
                    <div>
                        <span>@{postById?.postData?.user?.userName}</span>
                        <span>·</span>
                        <span>{timeDifference(new Date(), new Date(postById?.postData?.createdAt))}</span>
                    </div>
                </div>
                <div className="postById__containerRightTweetsInfoBody">
                   {postById?.postData?.retweetData !== undefined ? <span>{postById?.postData?.retweetData?.content}</span> :<span>{postById?.postData?.content}</span>}
                </div>
                <div className="postById__containerRightTweetsInfoFooter">
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
                      postById?.postData?.retweetData === undefined ? <IconButton disabled className="retweet" onClick={() => handleRetweetClick(postById._id)}>
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
                      <IconButton disabled className="like" onClick={() => handleLikeClick(postById._id)}>
                        <FavoriteIcon style={{color:"rgb(255 82 62)", fontSize:"18px"}} />
                        <span style={{fontSize:"16px", color:"rgb(255 82 62)"}}>{postById?.postData?.likes?.length}</span>
                      </IconButton>
                      :
                      <IconButton disabled className="like" onClick={() => handleLikeClick(postById._id)}>
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
            </>


          </div>}
          <div className="postById__containerRightTweet">
        <div>
            <Avatar src={userInfo?.image} style={{width:"50px", height:"50px"}} />
        </div>
        <div className="postById__containerRightTweetText">
            <textarea placeholder="What's Happening" value={replyContent} onChange={handleReplyChange} />
            <div style={{display:"flex", justifyContent:"space-between"}}>
            {replyContent.length > 0 && userInfo ? <Button onClick={() => handleReplyClick(postById?.postData?._id)}>Reply</Button> : <Button disabled>Reply</Button>}
            <div className="postById__modalCloseButton">
            <Button onClick={handleClose}>Close</Button>
            </div>
            </div>
        </div>
        
        </div>
          </div>
          </div>
        </Fade>
      </Modal>
        </div>
    )
}

export default PostByIdReply
