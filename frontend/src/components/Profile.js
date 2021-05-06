import { Avatar, Button, CircularProgress } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
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
import Tweets from './Tweets';
import { useLocation } from 'react-router-dom';
import { followUser } from '../actions/userActions';

function Profile() {
    const match = window.location.pathname.split("/").length >= 3 ? window.location.pathname.split("/")[2] : undefined

    const {userInfo} = useSelector(state => state.userLogin)
    const {loading, profile} = useSelector(state => state.userProfile)
    const location = useLocation()

    const dispatch = useDispatch()

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
    }

    useEffect(() => {
        if(match === undefined) {
            dispatch(getProfile())
        } else {
            dispatch(getProfileByUsername(match))
        }
        
    }, [dispatch, match])

    return (
        <div className="profile">
            <Sidebar />
            {loading ? <CircularProgress style={{color:"#55acee", marginLeft:"40%", marginTop:"25%", width:"100px", height:"100px"}} /> : <div className="profile__container">
            <div className="profile__containerHeader">
                <h2>{match === undefined ?  userInfo?.userName : match}</h2>
            </div>
            <div className="profile__containerImage">
                <div className="profile__containerImageCover">
                    <img src="https://images.pexels.com/photos/3572123/pexels-photo-3572123.jpeg?cs=srgb&dl=pexels-phillip-m-3572123.jpg&fm=jpg" alt="" />
                </div>
                <div className="profile__containerImageProfilePicture">
                    <Avatar src="https://i.pinimg.com/originals/1a/5c/a6/1a5ca60c5957bab91092395790a814b2.jpg" style={{width:"150px", height:"150px"}} />
                </div>
                 <div className="profile__containerImageButtons">
                    <Button className="profile__containerImageMessageButton"><EmailIcon /></Button>
                    {userInfo?.id !== profile?.userProfile?._id 
                    ?
                    profile?.userProfile?.followers?.includes(userInfo?.id) 
                    ?
                     <Button className="profile__containerImageFollowingButton" onClick={handleFollowClick}>Following</Button> 
                     : 
                     <Button className="profile__containerImageFollowButton" onClick={handleFollowClick}>Follow</Button>
                     :
                      null}
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
                        <span style={{color:"rgba(122, 119, 119, 0.651)", marginLeft:"4px"}}> Followers</span>
                    </div>
                    <div>
                        <b>{profile?.userProfile?.following?.length}</b>
                    </div>
                    <div>
                        <span style={{color:"rgba(122, 119, 119, 0.651)", marginLeft:"4px"}}> Following</span>
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

        </div>
    )
}

export default Profile
