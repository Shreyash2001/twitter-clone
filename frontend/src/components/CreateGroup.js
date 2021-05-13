import React, { useEffect, useRef, useState } from 'react'
import Sidebar from './Sidebar'
import "./CreateGroup.css"
import { Avatar, Button, CircularProgress } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchedUsers } from '../actions/userActions'
import { createChat } from '../actions/chatActions'
import { useHistory } from 'react-router'


function CreateGroup() {
    const dispatch = useDispatch()
    const searchInput = useRef(null)
    const {users, loading: loadingUsers} = useSelector(state => state.searchedUsers)
    const {userInfo} = useSelector(state => state.userLogin)
    const {loading, chat, success} = useSelector(state => state.chatsInfo)
    const history = useHistory()

    const [save, setSave] = useState([])
    const [data, setData] = useState([])
    var timer;
    var valueSearch
  const handleChangeSearch = (e) => {
    clearTimeout(timer)
    
    searchInput.current.addEventListener("keydown", function(event) {
        if(valueSearch === "" && event.which === 8) {
            const savedUserName = save.pop()
            const savedUserId = data.pop()
            setSave([...save, savedUserName])
            setData([...data, savedUserId])
        }
  })
  
    

    timer = setTimeout(() => {
      valueSearch = e.target.value.replace(/\s/g,'')
        dispatch(getSearchedUsers(valueSearch))
     
    }, 1000)
  }
  

    const handleClick = (userName, id) => {
        if(save[0]  === undefined && data[0] === undefined) {
            save.pop()
            data.pop()
        }
        setSave([...save, userName]) 
        setData([...data, id]) 
        searchInput.current.value = ""
        searchInput.current.focus()
    }
    
   const handleCreateChatClick = () => {
       dispatch(createChat(JSON.stringify(data)))
   }

   useEffect(() => {
       
    if(success) {
        history.push(`/messages/${chat?._id}`)
    }
   }, [chat, history, success])

    return (
        <div className="createGroup">
            <Sidebar />
            <div className="createGroup__container">
                <div className="createGroup__containerHeader">
                    <h2>New Message</h2>
                </div>

                <div className="createGroup__containerSearch">
                    <div style={{borderBottom:"1px solid lightgray"}}>
                    <label>To:</label>
                    {save[0] !== undefined && save?.map(username => (<span style={{border:"1px light #55acee", fontSize:"16px", padding:"5px", marginRight:"10px", backgroundColor:"rgb(97 174 233 / 48%)", color:"#55acee", fontWeight:"700"}}>{username}</span>))}
                    <input id="searchbox" ref={searchInput} type="text" placeholder="Name of the person" onChange={handleChangeSearch} autoFocus />
                    </div>
                    {loadingUsers ? <CircularProgress style={{color:"#55acee", marginLeft:"35%", marginTop:"10px"}} /> : users?.length > 0 ? users?.map(user => ( user._id !== userInfo?.id && !save.includes(user.userName) &&
            <div style={{display:"flex", alignItems:"center", position:"relative"}} onClick={() => handleClick(user?.userName, user?._id)}>
                <Avatar src={user?.image} />
                <div style={{display:"flex", alignItems:"center", marginLeft:"10px"}}>
                    <h4>{user?.firstName} {user?.lastName}</h4>
                    <span style={{marginLeft:"5px", fontSize:"14px", color:"rgba(122, 119, 119, 0.651)"}}>@{user?.userName}</span>
                </div>
              
            </div>
        )) : null}
            {loading ? 
                <CircularProgress style={{color:"#55acee", marginLeft:"35%", marginTop:"10px"}} /> 
                :
                save.length > 0 && save[0] !== undefined ? 
                <Button className="createGroup__containerSearchButton" onClick={handleCreateChatClick}>Create Chat</Button> 
                :
                
                <Button disabled className="createGroup__containerSearchButtonDisabled">Create Chat</Button> 
                }
                </div>
                
            </div>
        </div>
    )
}

export default CreateGroup
