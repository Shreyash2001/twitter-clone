import React, { useEffect, useState } from 'react'
import "./Search.css"
import Sidebar from './Sidebar'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchedPosts } from '../actions/postActions';
import { getSearchedUsers } from '../actions/userActions';
import { followUser } from '../actions/userActions';
import Tweets from "../components/Tweets"
import { Avatar, Button, CircularProgress, SnackbarContent } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';


function Search({messageNotification}) {

  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }
  const [openNotification, setOpenNotification] = useState(false);
  const [transition, setTransition] = useState(undefined);

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenNotification(false);
  };

  useEffect(() => {
    if(messageNotification !== null) {
        setOpenNotification(true)
        setTransition(() => TransitionLeft);
    }
}, [messageNotification])

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
              <Box p={3}>
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
      const dispatch = useDispatch()
      const {userInfo} = useSelector(state => state.userLoggedInFollowers)
      const {posts, loading: loadingPosts} = useSelector(state => state.searchedPosts)
      const {users, loading: loadingUsers} = useSelector(state => state.searchedUsers)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  var timer;
  var valueSearch = ""
  const handleChangeSearch = (e) => {
    clearTimeout(timer)
    

    timer = setTimeout(() => {
      valueSearch = e.target.value.replace(/\s/g,'')
      
      if(value === 0) {
        dispatch(getSearchedPosts(valueSearch))
      } else {
        dispatch(getSearchedUsers(valueSearch))
      }
    }, 1000)
    
  }


    return (
        <div className="search">
        <Snackbar
        bodyStyle={{ backgroundColor: 'teal', color: 'coral' }}
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
            <Sidebar />
            <div className="searchContainer">
            <div className="searchContainer__searchbar">
            <SearchIcon />
                <input 
                onChange={handleChangeSearch}
                type="text" placeholder="Search for users or posts"
                 />
            </div>
            <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab  label="Posts" {...a11yProps(0)} />
          <Tab label="Users" {...a11yProps(1)} />
          
        </Tabs>
      </AppBar>
      <TabPanel style={{padding:"0"}} value={value} index={0}>
      
        {!loadingPosts ? posts?.length > 0 ? posts?.map(post => (
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
        )) : <img style={{padding:"20px"}} src="https://image.freepik.com/free-vector/team-leader-teamwork-concept_74855-6671.jpg" alt="search" /> : <CircularProgress />}
        
      </TabPanel>
      <TabPanel value={value} index={1}>
      {loadingUsers ? <CircularProgress /> : users?.length > 0 ? users?.map(user => (
            <div style={{display:"flex", alignItems:"center", position:"relative"}}>
                <Avatar src={user?.image} />
                <div style={{display:"flex", alignItems:"center", marginLeft:"10px"}}>
                    <Link style={{color:"black", textDecoration:"none"}} to={`/profile/${user?.userName}`}><h4>{user?.firstName} {user?.lastName}</h4></Link>
                    <span style={{marginLeft:"5px", fontSize:"14px", color:"rgba(122, 119, 119, 0.651)"}}>@{user?.userName}</span>
                </div>
              {userInfo?._id !== user?._id 
              ?
               userInfo?.following?.includes(user?._id) 
              ?
              <Button onClick={() => dispatch(followUser(user?._id))} style={{textTransform:"inherit", position:"absolute", right:"0", borderRadius:"22px", backgroundColor:"#55acee", color:"white"}}>Following</Button>
               :  
               <Button onClick={() => dispatch(followUser(user?._id))} style={{textTransform:"inherit",position:"absolute", right:"0", borderRadius:"22px", border:"1px solid #55acee", color:"#55acee"}}>Follow</Button>
               :
               null
               }
            </div>
        )) : <img style={{padding:"20px"}} src="https://image.freepik.com/free-vector/team-leader-teamwork-concept_74855-6671.jpg" alt="search" />}
      </TabPanel>
      
    </div>
            </div>
        </div>
    )
}

export default Search
