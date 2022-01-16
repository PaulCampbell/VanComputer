import { useState} from "react";
import { Link, Navigate} from "react-router-dom";

import ErrorList from './ErrorList';


function Login({jwt, setJwt, apiUrl }) {
  const [loginModel, setLoginModel] = useState({
    email: "",
    password:""
  }) 
  const [errors, setErrors] = useState([])

  const handleChange = (e) => {
    e.preventDefault();
    setLoginModel(Object.assign({}, loginModel, {[e.target.name]: e.target.value}))
  }

  const login = async () => {
     const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        body: JSON.stringify({email: loginModel.email, password: loginModel.password}),
        headers: { 'content-type': 'application/json' }
     })
     if(response.status === 401) {
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
     : <>
       <h1 className="title">
        Log in
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
      <button className="button" onClick={login}>Log in</button>
      <nav>
        <Link to="/register">Register</Link>
      </nav>
    </>
  );
}

export default Login;