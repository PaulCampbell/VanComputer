import  React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import ErrorList from './ErrorList';

function Register({ jwt, setJwt, apiUrl }) {
  const registrationOpen = true;

   const [user, setUser] = useState({
    email:'',
    password:'',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState([])

  const handleChange = (e) => {
    e.preventDefault();
    setUser(Object.assign({}, user, {[e.target.name]: e.target.value}))
  }

  const register = async (e) => {
    const response = await fetch(`${apiUrl}/api/users`, {
       method: 'POST',
       body: JSON.stringify(user),
       headers: { 'content-type': 'application/json' }
    })
    if(response.status === 400) {
      const {details} = await response.json()
      setErrors(details)
    } else {
       setErrors([])
       await login(user.email, user.password)
    }
  }

  const login = async (email, password) => {
     const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: { 'content-type': 'application/json' }
     })
     if(response.status === 400) {
       const {details} = await response.json()
       setErrors(details)
     } else {
       const jwt = await response.json()
       localStorage.setItem('jwt', jwt.token)
       setJwt(jwt.token)
     }
   }

  return (
     jwt ? <Navigate replace to='/dashboard' /> 
     : registrationOpen ? 
     <>
     <h1 className="title">
        Register
      </h1>
      <ErrorList errors={errors} />
      
      <div className="field">
        <label className="label" htmlFor="email">Email</label>
        <input className="input" onChange={handleChange} name="email"  id="email" type="email" placeholder="Email" />
      </div>
      <div className="field">
        <label className="label" htmlFor="password">Password</label>
        <input className="input" onChange={handleChange} name="password" id="password" type="password" />
      </div>
      <div className="field">
        <label className="label" htmlFor="confirmPassword">Confirm Password</label>
        <input className="input" onChange={handleChange} name="confirmPassword" id="confirmPassword" type="password" />
      </div>
      <button className="button" onClick={register}>Create Account</button>
      <nav>
        <Link to="/login">Login</Link>
      </nav>
    </> : <div>
      <h1 className="title">Registration is invite only...</h1>
      <p>
        Sorry - Registration is currently invite only.  If you want access, give us a shout on <a href="https://twitter.com/@paulcampbell_">Twitter</a>
       &nbsp;and I'll try and get you sorted.
      </p>
    </div>
  );
}

export default Register;