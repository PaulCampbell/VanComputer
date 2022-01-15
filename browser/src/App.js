import './App.css';
import { useState } from 'react';

function App() {
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
    const response = await fetch('/api/users', {
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
     const response = await fetch('/login', {
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
    <div>
      <header>
        <section class="section">
        <div class="container">
        <p>
          Some title,yeah?
        </p>
        </div>
        </section>
      </header>
      <main>
         <section class="section">
          <div class="container">
            <h1 class="title">
              Register
            </h1>
            { errors.length > 0 ? <div class="notification is-danger">
              <ul>
                {errors.map(error => {
                  return <li>
                    <label for={error.path && error.path.length > 0 ? error.path[0] : ""}>{error.message}</label>
                  </li>}
                )}
              </ul>
            </div> : null }
          
            <div class="field">
              <label class="label" for="email">Email</label>
              <input class="input" onChange={handleChange} name="email"  id="email" type="email" placeholder="Email" />
            </div>
            <div class="field">
              <label class="label" for="password">Password</label>
              <input class="input" onChange={handleChange} name="password" id="password" type="password" />
            </div>
            <div class="field">
              <label class="label" for="confirmPassword">Confirm Password</label>
              <input class="input" onChange={handleChange} name="confirmPassword" id="confirmPassword" type="password" />
            </div>
             <button class="button" onClick={register}>Create Account</button>
          </div>
        </section>
      </main>
    </div>

  );
}

export default App;
