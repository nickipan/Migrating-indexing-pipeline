import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../Assets/Logo.png'
import './Login.css'
import { createClient} from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'

const supabase = createClient(
  "https://glswwzdfwzmbynmuuwhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3d3emRmd3ptYnlubXV1d2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4ODI1ODQsImV4cCI6MjAyNjQ1ODU4NH0.V0Fs97rJCoA42jLIIIJ48Tp1nSUgktWvA5_cAhrNk3Q"
)

function Login() {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Sign in to KB-Indexer"

      supabase.auth.onAuthStateChange(async (event) => {
        if (event == "SIGNED_IN"){
            navigate("/indexerui");
        }
      })
    }
  )

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Vite logo" />
      </div>
      <p className='text'> Sign in to Knowledge Base Indexer</p>

      <Auth 
        supabaseClient={supabase}
        theme='dark'
        providers={['github']}
      />
    </>
  )
}

export default Login
