import React from 'react'
import Sidebar from './Sidebar'
import AddBoxIcon from '@material-ui/icons/AddBox';
import { IconButton } from '@material-ui/core';
import { useHistory } from 'react-router';

function Messages() {
    const history = useHistory()
    return (
        <div style={{display:"flex", margin:"0 200px 0 200px"}}>
            <Sidebar />
            <div style={{width:"700px", borderRight:"1px solid lightgray"}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid lightgray"}}>
            <div style={{marginLeft:"20px"}}>
                <h1 style={{fontWeight:"700"}}>Inbox</h1>
            </div>
            <div>
                <IconButton onClick={() => history.push("/messages/new")}><AddBoxIcon style={{color:"#55acee"}} /></IconButton>
            </div>
            </div>
            </div>
        </div>
    )
}

export default Messages
