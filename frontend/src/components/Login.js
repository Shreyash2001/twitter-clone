import React, { useEffect, useState } from 'react'
import "./Login.css"
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import {useDispatch, useSelector} from "react-redux"
import { userLogin } from '../actions/userActions';
import { CircularProgress } from '@material-ui/core';

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const userName = email

    const history = useHistory()
    const dispatch = useDispatch()
    const {loading, success, error} = useSelector(state => state.userLogin)

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(userLogin(email, userName, password)) 
    }

    useEffect(() => {
        if(success) {
            history.push("/")
        }
    }, [success, history])
    return (
        <div className="login">
            <div className="login__left">
                <div>
                    <h2>Not have an Account?</h2>
                    <Button variant="outlined" onClick={() => history.push("/register")}>Register</Button>
                </div>
            </div>

            <div className="login__right">
                <div>
                    <h1>Signin and start exploring the world's thought</h1>
                </div>
                <div className="login__rightForm">
                    <form onSubmit={handleSubmit}>
                        <input placeholder="email or username" type="text" onChange={(e) => setEmail(e.target.value)} value={email} required />
                        <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        <div>
                            {error && <p style={{color:"red", marginLeft:"15%"}}>*{error}</p>}
                        </div>
                        {loading ? 
                        <div style={{marginTop:"10px", marginLeft:"27%"}}>
                        <CircularProgress style={{color:"#55acee"}} /> 
                        </div>
                        
                        :
                         <Button type="submit">Login</Button>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
