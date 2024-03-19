import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.png'
import './Login.css'
import { useAuth, useLoginWithRedirect, ContextHolder } from "@frontegg/react";

function Login() {
  const { user, isAuthenticated } = useAuth();
  const loginWithRedirect = useLoginWithRedirect();

  const logout = () => {
    const baseUrl = ContextHolder.getContext().baseUrl;
    window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
  };

  let navigate = useNavigate();

  function navigatePage() {
    loginWithRedirect();
    navigate("indexerui");
  }

  useEffect(() => {
    document.title = "Sign in to KB-Indexer"
  })

  return (
    <div>
      <div>
        <img src={logo} className="logo" alt="Vite logo" />
      </div>
      <p className='text'> Sign in to Knowledge Base Indexer</p>

      <div className='loginForm'>
        <form action="">
          <button className="loginButton" onClick={() => loginWithRedirect()}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
  return (
    <div className="Login">
      {isAuthenticated ? (
        <div>
          <div>
            <img src={user?.profilePictureUrl} alt={user?.name} />
          </div>
          <div>
            <span>Logged in as: {user?.name}</span>
          </div>
          <div>
            <button onClick={() => alert(user.accessToken)}>What is my access token?</button>
          </div>
          <div>
            <button onClick={() => logout()}>Click to logout</button>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={() => loginWithRedirect()}>Click me to login</button>
        </div>
      )}
    </div>
  );
}

export default Login
