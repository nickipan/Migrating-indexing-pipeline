import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.png'
import './Login.css'

function Login() {
  let navigate = useNavigate();
  
  function navigatePage() {
    if (document.getElementById("username").value == "admin" && document.getElementById("password").value == "admin") {
      navigate("Indexer");
    } 
    else {
      alert("Wrong username/password");
    }
  }

  useEffect(() => {
      document.title = "Sign in to KB-Indexer"
    } 
  )

  return (
    <>
      <div>
          <img src={logo} className="logo" alt="Vite logo" />
      </div>
      <p className='text'> Sign in to Knowledge Base Indexer</p>
      
      <div className='loginForm'>
        <form action="">
          <p className='loginText'> Username</p>
          <div>
            <input className='loginField' type="text" id='username'/>
          </div>

          <p className='loginText'> Password</p>
          <div>
            <input className='loginField' type="password" id='password'/>
          </div>

          <button className="loginButton" onClick={ navigatePage }>
          Login
          </button>
        </form>
      </div>
    </>
  )
}

export default Login
