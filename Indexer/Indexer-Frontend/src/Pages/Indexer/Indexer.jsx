import { useState } from 'react'
import logo from '../../assets/Logo.png'
import './Indexer.css'

import source from "./Data/Source/Source.json"
import resource from "./Data/Resource/Resource.json"
import periodic from "./Data/Periodic/Periodic.json"

function Indexer() {
  document.title = "KB-Indexer"
  const [startPressed, setStartPressed] = useState(false)

  // Received data
  const [stat, setStatus] = useState('0')
  const [duration, setDuration] = useState('0 Min')
  const [startTime, setStartTime] = useState('-')
  const [completed, setCompleted] = useState('No')
  const [content, setContent] = useState('-')

  function isPressed() {
    setStartPressed(true);
    sendData();
  }

  function refresh() {
    fetch('http://127.0.0.1:5000/getIndexData')
      .then(response => response.json())
      .then(data => {
        setStatus(data.status),
          setDuration(data.duration),
          setStartTime(data.startTime),
          setCompleted(data.completed),
          setContent(data.content)
      })
  }

  const sendData = async () => {
    var source = document.getElementById("source").value;
    var resource = document.getElementById("resource").value;
    var periodic = document.getElementById("periodic").value;
    var isResourceTypeOnly = (source == "No Source Type") ? true : false
    var isPeriodic = (periodic == "Not Periodic") ? false : true

    const res = fetch(
      "http://127.0.0.1:5000/sendIndexData",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
          {
            sourceType: source,
            resourceType: resource,
            resourceTypeOnly: isResourceTypeOnly,
            periodic: isPeriodic,
            timePeriod: periodic
          }
        )
      }
    )
      .then(res => console.log(res))
  }


  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Vite logo" />
      </div>
      <p className="text">
        Choose your Source, Resource and Period.
      </p>

      <p className="resourceText">
        Resource type
      </p>
      <div className='resource'>
        <select className='select' id='resource'>
          {resource.map((o) => <option value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <p className="sourceText">
        Source type
      </p>
      <div className='source'>
        <select className='select' id='source'>
          {source.map((o) => <option value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <p className="periodicText">
        Period
      </p>
      <div className='periodic'>
        <select className='select' id='periodic'>
          {periodic.map((o) => <option value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Start Button */}
      <button className="startButton" onClick={isPressed}>
        Start Indexing
      </button>


      {startPressed &&
        <div>
          <button className="refreshButton" onClick={refresh}>
            Refresh
          </button>

          <p className="progressText">
            Progress: {stat} % <br />
            Duration: {duration} <br />
            Start Time: {startTime} <br />
            Completed: {completed} <br />
            Content: {content} <br />
          </p>
        </div>
      }
    </>
  )
}

export default Indexer
