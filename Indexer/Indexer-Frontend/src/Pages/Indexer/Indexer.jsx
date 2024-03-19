import { useState, useEffect } from 'react'
import logo from '../../assets/Logo.png'
import { useNavigate} from 'react-router-dom';

import './Indexer.css'
import IndexerComponent from './IndexerComponent'
import { FaPlusCircle } from "react-icons/fa";
import { useAuth, useLoginWithRedirect, ContextHolder } from "@frontegg/react";


function Indexer() {
  document.title = "KB-Indexer"
  const [components, setComponents] = useState([<IndexerComponent />]);
  const [instanceNumber, setInstanceNumber] = useState(1);
  const { user, isAuthenticated } = useAuth();
  const loginWithRedirect = useLoginWithRedirect();

  // Uncomment this to redirect to login automatically
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  const logout = () => {
    const baseUrl = ContextHolder.getContext().baseUrl;
    window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
  };

  let navigate = useNavigate();

  function addJob() {
    var number = instanceNumber - 1
    setComponents([<IndexerComponent />, components])
    setInstanceNumber(number)
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <div>
            <img src={logo} className="logo" alt="Vite logo" />
          </div>
          <p className="chooseText">
            Choose your Source, Resource and Period.
          </p>
          <p className="jobsText">
            Add new jobs
          </p>

          <button className="ongoing1" onClick={() => navigate("ongoing")}>
            Ongoing jobs
          </button>

          <button className="addNewJob" onClick={addJob}>
            <FaPlusCircle />
          </button>
          {components}
        </>
      ) : (
        <>
          <>
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
          </>
        </>
      )}
    </div>
  )
}

export default Indexer