import { useState, useEffect } from 'react'
import logo from '../../assets/Logo.png'
import { useNavigate } from 'react-router-dom';

import './Indexer.css'
import IndexerComponent from './IndexerComponent'
import { FaPlusCircle } from "react-icons/fa";


function Indexer() {
  document.title = "KB-Indexer"
  const [components, setComponents] = useState([<IndexerComponent/>]);
  const [instanceNumber, setInstanceNumber] = useState(1);

  let navigate = useNavigate();

  function addJob() {
    var number = instanceNumber -1
    setComponents([<IndexerComponent/>, components])
    setInstanceNumber(number)
  }

 
  return (
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
  )
}

export default Indexer
