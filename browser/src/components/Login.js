import { useState} from "react";
import { Link, Navigate} from "react-router-dom";

function Login({jwt, setJwt }) {
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
     const response = await fetch('http://localhost:3333/login', {
        method: 'POST',
        body: JSON.stringify({email: loginModel.email, password: loginModel.password}),
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
     : <>
       <h1 className="title">
        Log in
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
      <button className="button" onClick={login}>Log in</button>
      <nav>
        <Link to="/register">Register</Link>
      </nav>
    </>
  );
}

export default Login;