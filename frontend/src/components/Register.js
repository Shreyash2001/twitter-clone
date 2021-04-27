import React, { useEffect, useState } from 'react'
import "./Register.css"
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { userRegister } from '../actions/userActions';
import { CircularProgress } from '@material-ui/core';

function Register() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordCheck, setPasswordCheck] = useState(false)
    const [passwordRegex, setPasswordRegex] = useState(false)
    var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/

    const history = useHistory()
    const dispatch = useDispatch()
    const {loading, success, error} = useSelector(state => state.userRegister)

    const handleSubmit = (e) => {
        e.preventDefault()
        if(password === confirmPassword) {
            if(regex.test(password)) {
                dispatch(userRegister(firstName, lastName, userName, email, password))
            } else {
                setPasswordRegex(true)
            }
            
        } else {
            setPasswordCheck(true)
        }
        
    }

    useEffect(() => {
        if(success) {
            history.push("/")   
        }
    }, [history, success])

    return (
        <div className="register">
            <div className="register__left">
                <div>
                    <h2>Already have an Account?</h2>
                    <Button variant="outlined" onClick={() => history.push("/login")}>Login</Button>
                </div>
            </div>

            <div className="register__right">
                <div>
                    <h1>Join Twitter Today and start exploring the world's thought</h1>
                </div>
                <div className="register__rightForm">
                    <form onSubmit={handleSubmit}>
                        <input placeholder="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <input placeholder="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        <input placeholder="Username" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <Button type="submit">Register</Button>
                        <div>
                        {error && <p style={{color:"red", marginLeft:"15%"}}>*{error}</p>}
                        {!loading && passwordRegex && <span style={{color:"red", marginTop:"5px"}}>*Minimum 8 Characters, One Uppercase, One Lowercase, Number & Special Symbol needed for password</span>}
                        {!loading && passwordCheck && <span style={{color:"red", marginLeft:"15%"}}>*Password Did not match</span>}
                        <div style={{marginTop:"15px", marginLeft:"27%"}}>
                            {loading && <CircularProgress style={{color:"#55acee"}} />}
                        </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
