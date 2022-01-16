import './App.css';
import React, { useState } from "react";
import { Routes, Route, Link, Navigate} from "react-router-dom";


import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [jwt, setJwt] = useState(localStorage.getItem('jwt'));
  const logout = () => {
    localStorage.removeItem('jwt')
    setJwt(null)
  }
  return (
    <div>
      <header>
        <section className="section">
        <div className="container">
        <p>
          Some title,yeah?
        </p>
        { jwt ? <a onClick={logout}>Logout</a> : null }
        </div>
        </section>
      </header>
      <main>
         <section className="section">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home jwt={jwt}  />} />
              <Route path="/register"  element={<Register jwt={jwt} setJwt={setJwt} />} />
              <Route path="/login" element={<Login jwt={jwt} setJwt={setJwt} />} />
              <Route path="/dashboard" element={<Dashboard jwt={jwt} />} />
            </Routes>
          </div>
        </section>
      </main>
    </div>

  );
}

export default App;

function Dashboard({ jwt }) {
  return (
    jwt ? <>
      <main>
        <h2>Dashboard</h2>
      </main>

    </> : 
     <Navigate replace to='/login' />
  );
}

function Home({ jwt }) {
  return (
    jwt ? <Navigate replace to='/dashboard' />
    : <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>
      </main>
      <nav>
        <Link to="/about">About</Link>
      </nav>
    </>
  );
}