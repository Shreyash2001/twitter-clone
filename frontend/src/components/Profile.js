import { Avatar, Button, CircularProgress, Slide, Snackbar, SnackbarContent } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import "./Profile.css"
import Sidebar from './Sidebar'
import EmailIcon from '@material-ui/icons/Email';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, getProfileByUsername } from '../actions/profileActions';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import CreateIcon from '@material-ui/icons/Create';
import Tweets from './Tweets';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { followUser, updateUserCoverImage, updateUserImage } from '../actions/userActions';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { TEMP_DATA_FOR_NOTIFICATION, TEMP_DATA_FOR_NOTIFICATION_RESET } from '../constants/notificationConstants';
import { updateUserNotification } from '../actions/notificationActions';
import { createChat } from '../actions/chatActions';



function Profile({messageNotification, latestNotifications}) {
  var loadingPreview = false
  const myContainer = useRef(null);
  const [cropper, setCropper] = useState("");
  const [cropData, setCropData] = useState("#");
  
  
  const useStylesModal = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    paperModal: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2, 4, 3),
      maxWidth:"600px",
      minWidth:"300px"
    },
  }));

  const classesModal = useStylesModal();
  const [openModal, setOpenModal] = useState(false);
  const [openModalCover, setOpenModalCover] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };
  const handleOpenCover = () => {
    setOpenModalCover(true);
  };

  const handleCloseCover = () => {
    setOpenModalCover(false);
  };

  const handleCoverClick = () => {
    setOpenModalCover(true);
  }

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };

    const match = window.location.pathname.split("/").length >= 3 ? window.location.pathname.split("/")[2] : undefined

    const {userInfo} = useSelector(state => state.userLogin)
    const {loading, profile} = useSelector(state => state.userProfile)
    const location = useLocation()
    const history = useHistory()

    const dispatch = useDispatch()

    const [image, setImage] = useState('');
    const [cover, setCover] = useState('');
    const [disable, setDisable] = useState(true)
    const [disableCover, setDisableCover] = useState(true)
    const [url, setUrl] = useState(undefined)
    const [coverUrl, setCoverUrl] = useState(undefined)
    const inputRef = React.useRef();
    const inputRefCover = React.useRef();
    const triggerFileSelectPopup = () => inputRef.current.click();
    const triggerFileSelectPopupCover = () => inputRefCover.current.click();

    const onSelectFile = (event) => {
      if (event.target.files && event.target.files.length > 0) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.addEventListener("load", () => {
          setImage(reader.result);
        });  
        
      }
        setDisable(false)
    };
    const onSelectFileCover = (event) => {
      if (event.target.files && event.target.files.length > 0) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.addEventListener("load", () => {
          setCover(reader.result);
        });  
        
      }
      setDisableCover(false)
    };
  

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div
              role="tabpanel"
              hidden={value !== index}
              id={`simple-tabpanel-${index}`}
              aria-labelledby={`simple-tab-${index}`}
              {...other}
            >
              {value === index && (
                <Box style={{padding:"0px"}} p={3}>
                  <Typography>{children}</Typography>
                </Box>
              )}
            </div>
          );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
      };
      

    function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }

    const useStyles = makeStyles((theme) => ({
        root: {
          flexGrow: 1,
          backgroundColor: theme.palette.background.paper,
        },
      }));

    const classes = useStyles();
    const [value, setValue] = useState(0);

  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    
    const handleFollowClick = () => {
      dispatch(followUser(profile?.userProfile?._id))
      dispatch({type: TEMP_DATA_FOR_NOTIFICATION_RESET})
    dispatch({
      type: TEMP_DATA_FOR_NOTIFICATION,
      payload: profile?.userProfile?._id
    })
    }

    const handleUploadClick = () => {
      dispatch(updateUserImage(url))
      setOpenModal(false);
    }

    
    useEffect(() => {
        if(match === undefined) {
            dispatch(getProfile())
        } else {
            dispatch(getProfileByUsername(match))
        }
        
    }, [dispatch, match])

    useEffect(() => {
      if(cropData){
        const data = new FormData()
              data.append('file', cropData)
              data.append('upload_preset', 'insta_clone')
              data.append('cloud_name', 'cqn')
    fetch('https://api.cloudinary.com/v1_1/cqn/image/upload', {
      method: 'post',
      body:data,
      loadingPreview:true,
    })
    .then(res=>res.json())
    .then(data => {
      setUrl(data.url)
    })
  }
      if(cover){
        const data = new FormData()
              data.append('file', cover)
              data.append('upload_preset', 'insta_clone')
              data.append('cloud_name', 'cqn')
    fetch('https://api.cloudinary.com/v1_1/cqn/image/upload', {
      method: 'post',
      body:data,
    })
    .then(res=>res.json())
    .then(data => {
      setCoverUrl(data.url)
    })
  }
    
    }, [cropData, cover ])

    const handleUploadCoverClick = () => {
      dispatch(updateUserCoverImage(coverUrl))
      setOpenModalCover(false);
    }

    const {success, chat} = useSelector(state => state.chatsInfo)

    var data = []
    const handleMessageClick = (id) => {
      data.push(id)
      dispatch(createChat(JSON.stringify(data)))
    }

    useEffect(() => {
      if(success) {
        history.push(`/messages/${chat?._id}`)
      }
    }, [history, chat, success])

    function TransitionLeft(props) {
      return <Slide {...props} direction="left" />;
    }

    const [openNotification, setOpenNotification] = useState(false);
      const [transition, setTransition] = useState(undefined);
      const [openLatestNotification, setOpenLatestNotification] = useState(false);
      const [transitionNotification, setTransitionNotification] = useState(undefined);

    const handleCloseNotification = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpenNotification(false);
    };
  const handleCloseLatestNotification = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpenLatestNotification(false);
    };

    useEffect(() => {
      if(messageNotification !== null) {
          setOpenNotification(true)
          setTransition(() => TransitionLeft);
      }
      if(latestNotifications.length > 0) {
          setOpenLatestNotification(true)
          setTransitionNotification(() => TransitionLeft);
      }
  }, [messageNotification, latestNotifications])

    return (
        <div className="profile">

        <div>
        <Snackbar
        open={openNotification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
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
        open={openLatestNotification}
        autoHideDuration={6000}
        onClose={handleCloseLatestNotification}
        TransitionComponent={transitionNotification}
        key={transitionNotification ? transitionNotification.name : ''}
        style={{position:"absolute", top:"15%", left:"80%", width:"100px", height:"40px"}}
      >
          <SnackbarContent 
          style={{backgroundColor:"#fff"}}
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
            
            {loading ? <CircularProgress style={{color:"#55acee", marginLeft:"40%", marginTop:"25%", width:"100px", height:"100px"}} /> : <div className="profile__container">
            <div className="profile__containerHeader">
                <h2>{match === undefined ?  userInfo?.userName : profile?.userProfile?.userName}</h2>
            </div>
            <div className="profile__containerImage">
            {userInfo?.id === profile?.userProfile?._id && <div>
            <CreateIcon onClick={handleCoverClick} style={{position:"absolute", right:"0", padding:"10px", border:"2px solid #fff", color:"#fff", borderRadius:"44px", fontSize:"30px", margin:"10px", cursor:"pointer"}} />
            <input type="file" accept="image/*" ref={inputRefCover} onChange={onSelectFileCover} style={{display:"none"}} />
            </div>}
                <div className="profile__containerImageCover">
                  {profile?.loading ? <CircularProgress /> :  <img src={profile?.userProfile?.coverPhoto} alt="" />}
                    
                </div>
                <div className="profile__containerImageProfilePicture">
                   <Avatar src={profile?.userProfile?.image} style={{width:"150px", height:"150px"}}></Avatar>
                   
                </div>
                 <div id="profile__containerImageButtons" className="profile__containerImageButtons">
                  {userInfo?.id !== profile?.userProfile?._id &&  <Button className="profile__containerImageMessageButton" onClick={() => handleMessageClick(profile?.userProfile?._id)}><EmailIcon /></Button>}
                    
                    {userInfo?.id !== profile?.userProfile?._id 
                    ?
                    profile?.userProfile?.followers?.includes(userInfo?.id) 
                    
                    ?
                     <Button className="profile__containerImageFollowingButton" onClick={handleFollowClick}>Following</Button> 
                     : 
                     <Button className="profile__containerImageFollowButton" onClick={handleFollowClick}>Follow</Button>
                     :
                      <Button style={{fontSize:"16px", textTransform:"inherit", backgroundColor:"#55acee", color:"#fff"}} onClick={handleOpen}><CameraAltIcon /> Edit Image</Button>}
                      
                </div> 
            </div>
            <div className="profile__containerUserInfo">
                <h2>{profile?.userProfile?.firstName} {profile?.userProfile?.lastName}</h2>
                <span>@{profile?.userProfile?.userName}</span>
                <div>
                    <div>
                        <b>{profile?.userProfile?.followers?.length}</b>
                    </div>
                    <div style={{marginRight:"10px"}}>
                        {match === undefined 
                        ? 
                        <Link to={`/profile/${userInfo?.userName}/followers`}><span style={{color:"rgba(122, 119, 119, 0.651)", marginLeft:"4px"}}> Followers</span></Link>
                        :
                        <Link to={`/profile/${match}/followers`}><span style={{color:"rgba(122, 119, 119, 0.651)", marginLeft:"4px"}}> Followers</span></Link>
                        }
                    </div>
                    <div>
                        <b>{profile?.userProfile?.following?.length}</b>
                    </div>
                    <div>
                    {match === undefined 
                    ?
                    <Link to={`/profile/${userInfo?.userName}/following`}><span style={{color:"rgba(122, 119, 119, 0.651)", marginLeft:"4px"}}> Following</span></Link>
                    :
                    <Link to={`/profile/${match}/following`}><span style={{color:"rgba(122, 119, 119, 0.651)", marginLeft:"4px"}}> Following</span></Link>
                    }
                        
                    </div>
                </div>
            </div>
            <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab label="Posts" {...a11yProps(0)} />
                <Tab label="Replies" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
            {profile?.posts?.map(post => (
            
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
              retweetUsers={post?.retweetUsers}
              likes={post?.likes}
              pinned={post?.pinned}
            />
        ))}
            </TabPanel>
            <TabPanel value={value} index={1}>
            {profile?.replies?.map(post => (
            
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
              retweetUsers={post?.retweetUsers}
              likes={post?.likes}
            />
        ))}
            </TabPanel>
        </div>
            </div>}
            <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classesModal.modal}
        open={openModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classesModal.paperModal}>
            <h1 style={{borderBottom:"1px solid lightgray"}} id="transition-modal-title">Upload Image</h1>
            <div style={{marginLeft:"70px"}} id="transition-modal-description">
            {image.length > 0 ? null : <Avatar style={{width:"150px", height:"150px"}} onClick={triggerFileSelectPopup} />}
            <input type="file" accept="image/*" ref={inputRef} onChange={onSelectFile} style={{display:"none"}} />
            </div>
            {loadingPreview ? <CircularProgress /> : <div style={{maxWidth:"500px"}}>
            
            {image.length > 0 ? null :  <img ref={myContainer} style={{maxWidth:"100%", maxHeight:"400px", objectFit:"contain"}} src={image} alt="" />}
           
           {url === undefined 
           ? 
           <Cropper
          style={{ maxHeight: "400px", width: "100%" }}
          initialAspectRatio={1}
          src={image}
          viewMode={1}
          guides={true}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false} 
          onInitialized={(instance) => {
            setCropper(instance);
          }}
        /> : <img src={url} style={{maxWidth:"100%", maxHeight:"400px", objectFit:"contain"}} alt="dp" />} 
                
            </div>
            }
            <div style={{display:"flex", justifyContent:"space-between", marginTop:"20px"}}>
              <Button onClick={handleClose} style={{textTransform:"inherit", border:"1px solid red", color:"red"}}>Cancel</Button>
             {url === undefined 
             ? 
             <Button disabled={disable} onClick={getCropData} style={{textTransform:"inherit", backgroundColor:"#55acee", color:"#fff"}}>Preview</Button> 
             :  
             <Button onClick={handleUploadClick} style={{textTransform:"inherit", backgroundColor:"#55acee", color:"#fff"}}>Upload</Button>}
            </div>
          </div>
        </Fade>
      </Modal>

      <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classesModal.modal}
        open={openModalCover}
        onClose={handleCloseCover}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModalCover}>
          <div className={classesModal.paperModal}>
          <h1 style={{borderBottom:"1px solid lightgray"}} id="transition-modal-title">Upload Image</h1>
            <div style={{marginLeft:"70px"}} id="transition-modal-description">
            {cover.length > 0 ? <img src={coverUrl} style={{maxWidth:"100%", maxHeight:"400px", objectFit:"contain"}} alt="loading......" /> : <Avatar src="image" style={{width:"150px", height:"150px"}} onClick={triggerFileSelectPopupCover} />}
          </div>
          <div style={{display:"flex", justifyContent:"space-between", marginTop:"20px"}}>
          <Button onClick={handleCloseCover} style={{textTransform:"inherit", border:"1px solid red", color:"red"}}>Cancel</Button>
          <Button onClick={handleUploadCoverClick} disabled={disableCover} style={{textTransform:"inherit", backgroundColor:"#55acee", color:"#fff"}}>Upload</Button>
          </div>
          </div>
        </Fade>
      </Modal>
      </div>
        </div>
    )
}

export default Profile
