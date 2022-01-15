import  React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

function Register() {
  const jwt = localStorage.getItem('jwt')
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
    const response = await fetch('http://localhost:3333/api/users', {
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
     const response = await fetch('http://localhost:3333/login', {
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
     }
   }

  return (
     jwt ? <Navigate replace to='/dashboard' /> 
     : <>
     <h1 className="title">
        Register
      </h1>
      { errors.length > 0 ? <div className="notification is-danger">
        <ul>
          {errors.map(error => {
            return <li>
              <label htmlFor={error.path && error.path.length > 0 ? error.path[0] : ""}>{error.message}</label>
            </li>}
          )}
        </ul>
      </div> : null }
    
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
    </>
  );
}

export default Register;