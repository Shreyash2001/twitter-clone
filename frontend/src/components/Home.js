import { Avatar, Button, CircularProgress } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import "./Home.css"
import { createPost, getPosts } from '../actions/postActions';
import Sidebar from './Sidebar';
import Tweets from './Tweets';

function Home() {

    const [content, setContent] = useState("")
    const dispatch = useDispatch()
    const {userInfo} = useSelector(state => state.userLogin)
    const {loading} = useSelector(state => state.createdPost)
    const {loading: loadingPosts, posts} = useSelector(state => state.getAllPosts)


    const handleChange = (e) => {
        setContent(e.target.value)
    }

    const handleClick = () => {
        dispatch(createPost(content))
        setContent("")
    }

    useEffect(() => {
        dispatch(getPosts(userInfo?.id))
    }, [dispatch])

    

    return (
        <div className="home">
        <div className="home__container">

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
            <div style={{display:"flex"}}>
            {content.length > 0 && userInfo ? <Button onClick={handleClick}>Tweet</Button> : <Button disabled>Tweet</Button>}
            <div style={{marginLeft:"5%", marginTop:"5%"}}>{loading && <CircularProgress style={{color:"#55acee", width:"20px", height:"20px"}} />}</div>
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
              retweetUsers={post?.retweetUsers}
              likes={post?.likes}
            />
        ))}
        </div>}
        </div>
        </div>
        </div>
    )
}

export default Home
