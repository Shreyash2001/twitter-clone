import { Avatar, Button, CircularProgress, IconButton } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import { userLogout } from '../actions/userActions'
import { useHistory } from 'react-router';
import {Link} from "react-router-dom"
import "./Home.css"
import { createPost, getPosts } from '../actions/postActions';
import { USER_POST_RESET } from '../constants/postConstants';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

function Home() {
    const [content, setContent] = useState("")

    const dispatch = useDispatch()
    const {userInfo} = useSelector(state => state.userLogin)
    const {loading, success} = useSelector(state => state.createdPost)
    const {loading: loadingPosts, posts, error} = useSelector(state => state.getAllPosts)
    const history = useHistory()

    const handleChange = (e) => {
        setContent(e.target.value)
    }

    const handleClick = () => {
        dispatch(createPost(content))
    }

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


    useEffect(() => {
        dispatch(getPosts())
        if(success) {
            setContent("")
            dispatch({type:USER_POST_RESET})
        }
    }, [dispatch, success])

    return (
        <div className="home">
        <div className="home__container">
        <div className="home__containerLeft">
        <div style={{marginBottom:"10px"}}>
        <IconButton><img src="https://img.icons8.com/fluent/48/000000/twitter.png" alt="twitter" /></IconButton>
        </div>
        <div className="home__icons">
            <img style={{width:"35px"}} src="https://img.icons8.com/ios/32/000000/home--v1.png" alt="" />
            <h3>Home</h3>
        </div>
        <div className="home__icons">
            <img style={{width:"35px"}} src="https://img.icons8.com/ios/48/000000/appointment-reminders--v1.png" alt="" />
            <h3>Notifications</h3>
        </div>
        <div className="home__icons">
            <img style={{width:"35px"}} src="https://img.icons8.com/ios/48/000000/important-mail.png" alt="" />
            <h3>Messages</h3>
        </div>
        {userInfo && <div className="home__icons">
            <img style={{width:"35px"}} src="https://img.icons8.com/fluent-systems-regular/48/000000/user-male-circle.png" alt="" />
            <h3>Profile</h3>
        </div>}
        {userInfo ? <div className="home__icons" onClick={() => dispatch(userLogout())}>
            <img style={{width:"35px"}} src="https://img.icons8.com/ios/50/000000/logout-rounded-left.png" alt="" />
            <h3>Logout</h3>
        </div> : 
        <div className="home__icons" onClick={() => history.push("/login")}>
            <img style={{width:"35px"}} src="https://img.icons8.com/ios/50/000000/login-rounded-right--v1.png" alt="" />
            <h3>Login</h3>
        </div>
        }
        </div>

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
            <div style={{display:"flex"}}>
            {content.length > 0 && userInfo ? <Button onClick={handleClick}>Tweet</Button> : <Button disabled>Tweet</Button>}
            <div>{loading && <CircularProgress style={{color:"#55acee"}} />}</div>
            </div>
        </div>
        
        </div>
        <div className="home__containerRightGap"></div>

        {posts?.map(post => (
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
                <div className="home__containerRightTweetsInfoBody">
                   <span>{post.content}</span>
                </div>
                <div className="home__containerRightTweetsInfoFooter">
                    <div>
                      <IconButton><ChatBubbleOutlineIcon style={{color:"grey"}} /></IconButton>
                      <IconButton><RepeatIcon style={{color:"grey"}} /></IconButton>
                      <IconButton><FavoriteBorderIcon style={{color:"grey"}} /></IconButton>
                    </div>
                </div>
            </div>
        </div>
        ))}

        </div>

        </div>
        </div>
    )
}

export default Home
