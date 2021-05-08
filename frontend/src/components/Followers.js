import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfileFollowers } from '../actions/profileActions';
import { Avatar, Button, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { followUser, getLoggedInUserfollowers } from '../actions/userActions';

function Followers() {
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
          
          backgroundColor: theme.palette.background.paper,
        },
      }));
      const classes = useStyles();
      const [value, setValue] = useState(0);

      const handleChange = (event, newValue) => {
        setValue(newValue);
        };
  const location = useLocation()
  const match = location.pathname.split("/")[2]
  const dispatch = useDispatch()
  const {userInfo, loading: loadingUsers} = useSelector(state => state.userLoggedInFollowers)
  const {followedUsers, loading} = useSelector(state => state.usersFollowers)

  const handleFollowClick = (id) => {
    dispatch(followUser(id))
    // dispatch(getLoggedInUserfollowers())
  }

  useEffect(() => {
    dispatch(getLoggedInUserfollowers())
    dispatch(getUserProfileFollowers(match))
    if(location.pathname.split("/")[3] === "followers"){
      setValue(0)
    } else {
      setValue(1)
    }
  }, [dispatch, match])
  
    return (
        <div style={{margin:"0 200px 0 200px", display:"flex"}}>
        <Sidebar />
        <div style={{borderRight:"1px solid lightgray", width:"700px"}}>
        <div style={{borderBottom:"1px solid lightgray"}}>
            <h2 style={{marginLeft:"20px"}}>{match}</h2>
        </div>
           {loading ? <CircularProgress /> : <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Followers" {...a11yProps(0)} />
          <Tab label="Following" {...a11yProps(1)} />
          
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {loadingUsers ? <CircularProgress /> : followedUsers?.followers?.map(follower => (
            <div style={{display:"flex", alignItems:"center", position:"relative"}}>
                <Avatar src={follower?.image} />
                <div style={{display:"flex", alignItems:"center", marginLeft:"10px"}}>
                    <Link style={{color:"black", textDecoration:"none"}} to={`/profile/${follower?.userName}`}><h4>{follower?.firstName} {follower?.lastName}</h4></Link>
                    <span style={{marginLeft:"5px", fontSize:"14px", color:"rgba(122, 119, 119, 0.651)"}}>@{follower?.userName}</span>
                </div>
              {userInfo?._id !== follower?._id 
              ?
               userInfo?.following?.includes(follower?._id) 
              ?
              <Button onClick={() => handleFollowClick(follower?._id)} style={{textTransform:"inherit", position:"absolute", right:"0", borderRadius:"22px", backgroundColor:"#55acee", color:"white"}}>Following</Button>
               :  
               <Button onClick={() => handleFollowClick(follower?._id)} style={{textTransform:"inherit",position:"absolute", right:"0", borderRadius:"22px", border:"1px solid #55acee", color:"#55acee"}}>Follow</Button>
               :
               null
               }
            </div>
        ))}
      </TabPanel>
      <TabPanel value={value} index={1}>
      {loadingUsers ? <CircularProgress /> : followedUsers?.following?.map(follower => (
            <div style={{display:"flex", alignItems:"center", position:"relative"}}>
                <Avatar src={follower?.image} />
                <div style={{display:"flex", alignItems:"center", marginLeft:"10px"}}>
                    <Link style={{color:"black", textDecoration:"none"}} to={`/profile/${follower?.userName}`}><h4>{follower?.firstName} {follower?.lastName}</h4></Link>
                    <span style={{marginLeft:"5px", fontSize:"14px", color:"rgba(122, 119, 119, 0.651)"}}>@{follower?.userName}</span>
                </div>
              {userInfo?._id !== follower?._id 
              ?
               userInfo?.following?.includes(follower?._id) 
              ?
              <Button onClick={() => handleFollowClick(follower?._id)} style={{textTransform:"inherit", position:"absolute", right:"0", borderRadius:"22px", backgroundColor:"#55acee", color:"white"}}>Following</Button>
               :  
               <Button onClick={() => handleFollowClick(follower?._id)} style={{textTransform:"inherit",position:"absolute", right:"0", borderRadius:"22px", border:"1px solid #55acee", color:"#55acee"}}>Follow</Button>
               :
               null
               }
            </div>
        ))}
      </TabPanel>
      
    </div>
}

    </div>
        </div>
    )
}

export default Followers
