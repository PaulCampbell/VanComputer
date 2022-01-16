import './App.css';
import React, { useState } from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import GithubCorner from 'react-github-corner';

import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddVehicle from './components/AddVehicle';

function App() {
  const apiUrl = 'http://localhost:3333';
  const [jwt, setJwt] = useState(localStorage.getItem('jwt'));
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('jwt')
    setJwt(null)
  }
  return (
    <div>
      <header className='has-background-primary-dark'>
       
       <GithubCorner
          href="https://www.github.com/TODO"
          bannerColor="#151513"
          octoColor="#fff"
          size={80}
          direction="right" 
        />

        <section className="section">
        <div className="container">
          <div className='columns is-mobile is-vcentered'>
            <div className='column is-four-fifths'>
              <a href="/" className='has-text-white is-size-2'>Van Computer</a>
            </div>
            <div className='column has-text-right'>
             { jwt ? <a href="#" onClick={logout} className='has-text-white'>Log out</a> : <a className='has-text-white' href="/login">Log in</a> }
             </div>
          </div>
        </div>
        </section>
      </header>
      <main>
         <section className="section">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home jwt={jwt} />} />
              <Route path="/register"  element={<Register jwt={jwt} setJwt={setJwt} apiUrl={apiUrl} />} />
              <Route path="/login" element={<Login jwt={jwt} setJwt={setJwt} apiUrl={apiUrl} />} />
              <Route path="/dashboard" element={<Dashboard jwt={jwt} apiUrl={apiUrl} />} />
              <Route path="/add-vehicle" element={<AddVehicle jwt={jwt} apiUrl={apiUrl} />} />
            </Routes>
          </div>
        </section>
      </main>
    </div>

  );
}

export default App;



function Home({ jwt }) {
  return (
    jwt ? <Navigate replace to='/dashboard' />
    : <>
      <main>
        <h1 className='title'>What's all this then?</h1>
        <p>
          This is a hacker friendly attempt at vehicle tracking for your camper van, inspired 
          by the <a href="https://www.rs-online.com/designspark/kickstart-kamper?social=twitter&post=f8a70ca1-7821-4940-a0a4-71a5b58fb7f5">Kickstart Kamper</a> project.
        </p>
        <h2 className='subtitle'>
          The Project
        </h2>
        <p>
          There are multiple parts to the project:
        </p>
        <h3>The API</h3>
        <p>
          So there's a server component.  This thing collects data sent from the little computer thing you're going to
          put in your van.  It also acts as the backend for the website.
        </p>
        <p>
          The API uses <a href="https://arc.codes">Architect</a> to generate a whole pile of lambdas and whatnot in AWS, where it runs. 
          It has a great local development story too. Worth checking out, or even better, why not learn about it while
          <a href="TODO"> making <strong>this code</strong> better</a>.
        </p>
        <h3>The Website</h3>
        <p>
          You're looking at the website right now. It's a little react app. 
        </p>
        <p>
          You can create an account here, register new vehicle computer things, and keep track of where your van is.
          (I mean - that's the intention... soon though.)
        </p>

        <h3>The Hardware</h3>
        <p>
          At the moment I have some code for an IOT device based on an ESP32.
        </p>
        <p>
          I suspect Raspberry Pi is probably a more popular choice, so help me out with some code 🙏
        </p>
        <br/>
        <h2 className='subtitle'>Sweet. How do I do it?</h2>
        <p>
           To run the current code, you're going to need an <a href="https://www.ebay.co.uk/itm/234189012090?epid=8005796317&hash=item3686c0bc7a:g:SYsAAOSwS9xhQbPj">ESP32 board</a>, 
           and a <a href="https://www.ebay.co.uk/itm/GY-NEO6MV2-NEO-6M-GPS-Module-NEO6MV2-Flight-Control-APM2-5-Antenhf-/265376093504">GPS module</a> of some sort.
         </p>
         <p>
           You'll also need wifi in your camper.  If you don't have wifi in your camper, you could do something with
           GPRS, but you're gonna want wifi in your camper anyway, so you might as well just go and sort that out now.
         </p>
         <h2 className='subtitle'>Got all those things together?</h2>
         <p>
           Nice work champ! <a href="/register">Let's get started</a>.
         </p>
      </main>
    </>
  );
}