import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.png'
import './Login.css'

function Login() {
  let navigate = useNavigate();

  function navigatePage() {
    navigate("indexerui");
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
          <button className="loginButton" onClick={navigatePage}>
            Login
          </button>
        </form>
      </div>
    </>
  )
}

export default Login
