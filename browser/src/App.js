import './App.css';
import * as React from "react";
import { Routes, Route, Link, Navigate} from "react-router-dom";


import Register from './components/Register';
import Login from './components/Login';

function App() {
  
  return (
    <div>
      <header>
        <section className="section">
        <div className="container">
        <p>
          Some title,yeah?
        </p>
        </div>
        </section>
      </header>
      <main>
         <section className="section">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </section>
      </main>
    </div>

  );
}

export default App;

function Dashboard() {
  const jwt = localStorage.getItem('jwt')
  return (
    jwt ? <>
      <main>
        <h2>Dashboard</h2>
      </main>

    </> : 
     <Navigate replace to='/login' />
  );
}

function Home() {
  const jwt = localStorage.getItem('jwt')

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