import { Avatar, Button, CircularProgress, IconButton, SnackbarContent } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import "./Home.css"
import { createPost, getPosts } from '../actions/postActions';
import Sidebar from './Sidebar';
import Tweets from './Tweets';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import { Link } from 'react-router-dom';
import { updateUserNotification } from '../actions/notificationActions';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';


function Home({messageNotification, latestNotifications}) {

    function TransitionLeft(props) {
        return <Slide {...props} direction="left" />;
      }
      const [open, setOpen] = useState(false);
      const [transition, setTransition] = useState(undefined);
      const [openNotification, setOpenNotification] = useState(false);
      const [transitionNotification, setTransitionNotification] = useState(undefined);
  
    const [content, setContent] = useState("")
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState(null)
    const dispatch = useDispatch()
    const {userInfo} = useSelector(state => state.userLogin)
    const {loading} = useSelector(state => state.createdPost)
    const {loading: loadingPosts, posts} = useSelector(state => state.getAllPosts)
    const inputRef = React.useRef();
    const triggerFileSelectPopup = () => inputRef.current.click();

    const onSelectFile = (event) => {
        if (event.target.files && event.target.files.length > 0) {
          const reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.addEventListener("load", () => {
            setImage(reader.result);
          });  
          
        }
      };

    const handleChange = (e) => {
        setContent(e.target.value)
    }

    const handleClick = () => {
        dispatch(createPost(content, url))
        setContent("")
        setImage(null)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenNotification(false);
      };

    useEffect(() => {
        dispatch(getPosts(userInfo?.id))
    }, [dispatch, userInfo])

    useEffect(() => {
        if(image){
            const data = new FormData()
                  data.append('file', image)
                  data.append('upload_preset', 'insta_clone')
                  data.append('cloud_name', 'cqn')
        fetch('https://api.cloudinary.com/v1_1/cqn/image/upload', {
          method: 'post',
          body:data,
          loadingPreview:true,
        })
        .then(res=>res.json())
        .then(imageData => {
          setUrl(imageData.url)
        })
      }
    }, [image])

    useEffect(() => {
        if(messageNotification !== null) {
            setOpen(true)
            setTransition(() => TransitionLeft);
        }
        if(latestNotifications.length > 0) {
            setOpenNotification(true)
            setTransitionNotification(() => TransitionLeft);
        }
    }, [messageNotification, latestNotifications])
        console.log(url)

    return (
        <div className="home">
        <div className="home__container">
        
            <div>
         <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionComponent={transition}
        key={transition ? transition.name : ''}
        style={{position:"absolute", top:"5%", left:"80%", width:"100px", height:"40px"}}
      >
          <SnackbarContent 
          style={{backgroundColor:"#fff"}}
              message={
            <Link to={`/messages/${messageNotification?.chat?._id}`} style={{textDecoration:"none", color:"#fff"}}>
            <div style={{display:"flex", alignItems:"center"}}>
            <div>
                <Avatar src={messageNotification?.sender?.image} />
            </div>
            <div style={{marginLeft:"10px", display:"flex", flexDirection:"column"}}>
                <span style={{fontSize:"18px", fontWeight:"600", color:"#55acee"}}>{messageNotification?.sender?.firstName} {messageNotification?.sender?.lastName}</span>
                <span style={{color:"darkgray"}}>{messageNotification?.content}</span>
            </div>
        </div>
        </Link>}
          />
      </Snackbar>
      </div>

          <div>
         <Snackbar
        open={openNotification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        TransitionComponent={transitionNotification}
        key={transitionNotification ? transitionNotification.name : ''}
        style={{position:"absolute", top:"15%", left:"80%", width:"100px", height:"40px"}}
      >
          <SnackbarContent 
          style={{backgroundColor:"#fff", overflowY:"auto"}}
              message={
                  <>
                  {latestNotifications?.map(latestNotification => (
                      <div style={{borderBottom:"1px solid lightgray", marginBottom:"10px", paddingBottom:"10px"}}>  
                {latestNotification?.notificationType === "postLike" && 
               
               <Link to={`/post/${latestNotification?.entityId}`} style={{textDecoration:"none", color:"#222222"}}> 
               <div onClick={() => dispatch(updateUserNotification(latestNotification?._id))} style={{display:"flex", alignItems:"center"}}>
                   <Avatar src={latestNotification?.userFrom?.image} title={latestNotification?.userFrom?.firstName} style={{marginRight:"10px"}} />
                   <span><b style={{fontSize:"16px", textTransform:"capitalize"}}>{latestNotification?.userFrom?.firstName} {latestNotification?.userFrom?.lastName}</b> has liked your post</span>
               </div>
               </Link>
                }
               {latestNotification?.notificationType === "retweet" && 
              
               <Link to={`/post/${latestNotification?.entityId}`} style={{textDecoration:"none", color:"#222222"}}> 
               <div onClick={() => dispatch(updateUserNotification(latestNotification?._id))} style={{display:"flex", alignItems:"center"}}>
                   <Avatar src={latestNotification?.userFrom?.image} title={latestNotification?.userFrom?.firstName} style={{marginRight:"10px"}} />
                   <span><b style={{fontSize:"16px", textTransform:"capitalize"}}>{latestNotification?.userFrom?.firstName} {latestNotification?.userFrom?.lastName}</b> has retweeted your post</span>
               </div>
               </Link>
                }
               {latestNotification?.notificationType === "reply" && 
              
               <Link to={`/post/${latestNotification?.entityId}`} style={{textDecoration:"none", color:"#222222"}}> 
               <div onClick={() => dispatch(updateUserNotification(latestNotification?._id))} style={{display:"flex", alignItems:"center"}}>
                   <Avatar src={latestNotification?.userFrom?.image} title={latestNotification?.userFrom?.firstName} style={{marginRight:"10px"}} />
                   <span><b style={{fontSize:"16px", textTransform:"capitalize"}}>{latestNotification?.userFrom?.firstName} {latestNotification?.userFrom?.lastName}</b> has replied to your post</span>
               </div>
               </Link>
                }
               {latestNotification?.notificationType === "follow" && 
              
               <Link to={`/profile/${latestNotification?.entityId}`} style={{textDecoration:"none", color:"#222222"}}> 
               <div onClick={() => dispatch(updateUserNotification(latestNotification?._id))} style={{display:"flex", alignItems:"center"}}>
                   <Avatar src={latestNotification?.userFrom?.image} title={latestNotification?.userFrom?.firstName} style={{marginRight:"10px"}} />
                   <span><b style={{fontSize:"16px", textTransform:"capitalize"}}>{latestNotification?.userFrom?.firstName} {latestNotification?.userFrom?.lastName}</b> started following you</span>
               </div>
               </Link>
                }
                </div>
                ))}
                </>
        }
          />
      </Snackbar>
      </div>

        <Sidebar />

        <div className="home__containerRight">
        <div className="home__containerRightHeader">
            <h2>Home</h2>
        </div>

        <div className="home__containerRightTweet">
        <div>
            <Avatar src={userInfo?.image} style={{width:"50px", height:"50px"}} />
        </div>
        <div className="home__containerRightTweetText">
            <textarea placeholder="What's Happening" value={content} onChange={handleChange} />
            <div>
            {image && <img style={{width:"500px", height:"500px", padding:"10px 0 10px 0px"}} src={image} alt="" />}
        </div>
            <div style={{display:"flex", alignItems:"center"}}>
            <Button onClick={triggerFileSelectPopup}  className="home__containerRightTweetTextImageButton">
            <InsertPhotoOutlinedIcon style={{fontSize:"30px", color:"#55acee"}} />
            Add photo
            </Button>
            <input type="file" accept="image/*" ref={inputRef} onChange={onSelectFile} style={{display:"none"}} />
            {content.length > 0 && userInfo 
            ? 
            <Button className="home__containerRightTweetButton" onClick={handleClick}>Tweet</Button>
             : 
            <Button className="home__containerRightTweetButtonDisabled" disabled>Tweet</Button>}

            <div style={{marginLeft:"5%", marginTop:"5%"}}>
            {loading 
            && 
            <CircularProgress style={{color:"#55acee", width:"20px", height:"20px"}} />}</div>
            </div>
        </div>
        </div>
        <div className="home__containerRightGap"></div>

       {loadingPosts ? <CircularProgress style={{color:"#55acee", marginLeft:"40%", width:"30px", height:"30px"}} /> : <div>

        {posts?.map(post => (
            
            <Tweets 
              key={post?._id}
              postId={post?._id}
              userId={post?.user?._id}
              retweetData={post?.retweetData}
              userImage={post?.user?.image}
              userName={post?.user?.userName}
              firstName={post.user?.firstName}
              lastName={post.user?.lastName}
              time={post?.createdAt}
              replyTo={post?.replyTo}
              userContent={post?.content}
              postImage = {post?.image}
              retweetUsers={post?.retweetUsers}
              likes={post?.likes}
              pinned={post?.pinned}
            />
        ))}
        </div>}
        </div>
        </div>
        </div>
    )
}

export default Home
