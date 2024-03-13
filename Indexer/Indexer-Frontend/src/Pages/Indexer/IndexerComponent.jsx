import { useState, useRef } from 'react'
import './Indexer.css'
import { FaMinusCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import source from "./Data/Source/Source.json"
import resource from "./Data/Resource/Resource.json"
import periodic from "./Data/Periodic/Periodic.json"


function IndexerComponent() {
  document.title = "KB-Indexer"
  const [startPressed, setStartPressed] = useState(false)
  const [sourceTypes, setSourceTypes] = useState(source.web)
  const [userId, setUserId] = useState('')
  const [notDeleted, setnotDeleted] = useState(true)

  const resourceRef = useRef(null);

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

  function deleteInstance() {
    setnotDeleted(false);
    deleteData();
  }

  const selectSourceType = (e) => {
    var resource = resourceRef.current.value;

    if (resource == 'web') {
      setSourceTypes(source.web);
    }

    if (resource == 'api') {
      setSourceTypes(source.web);
    }

    if (resource == 'notebook') {
      setSourceTypes(source.notebook);
    }

    if (resource == 'dataset') {
      setSourceTypes(source.dataset);
    }
  }

  // API calls
  // Refresh API call
  function refresh() {
    fetch(
      "http://localhost:5000/getIndexData1",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
          {
            id: userId,
            refresh: true
          }
        )
      }
    )

    fetch('http://localhost:5000/getIndexData2')
      .then(response => response.json())
      .then(data => {
        setStatus(data.status),
          setDuration(data.duration),
          setStartTime(data.startTime),
          setCompleted(data.completed),
          setContent(data.content)
      })
  }

  // Delete instance
  function deleteData() {
    fetch("http://localhost:5000/deleteData",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
          {
            id: userId,
            deleted: true
          }
        )
      }
    )
  }

  // Send data API call
  const sendData = async () => {
    var source = document.getElementById("source").value;
    var resource = document.getElementById("resource").value;
    var periodic1 = document.getElementById("periodic").value;
    var isResourceTypeOnly = (source == "No Source Type") ? true : false
    var isPeriodic = (periodic == "Not Periodic") ? false : true
    var date = new Date().toISOString();
    
    setUserId(date)

   console.log(date)
   console.log(isPeriodic)
   console.log(resource)
   console.log(isResourceTypeOnly)
   console.log(source)
   console.log(periodic1)

    const res = fetch(
      "http://127.0.0.1:8080/indexer/1.0.0/jobs",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body:JSON.stringify( 
          {
            "name": date,
            "periodic": isPeriodic,
            "resourceType": resource,
            "resourceTypeOnly": isResourceTypeOnly,
            "sourceType": source,
            "timePeriod": periodic1
          })
      }
    )
    .then(response => {
      if (!response.ok) {
        console.log(response)
        throw new Error('Network response was not ok');
      }
      console.log(response.json())
    })
  }

  return (
    <>
      <p className="text3"> Instance {userId}</p>
      <p className="resourceText">
        Resource type
      </p>
      <div className='resource' >
        <select className='select' id='resource' ref={resourceRef} onChange={selectSourceType}>
          {resource.map((o) => <option value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <p className="sourceText">
        Source type
      </p>
      <div className='source'>
        <select className='select' id='source'>
          {
            sourceTypes.map((o) => <option value={o.value}>{o.label}</option>)
          }
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
      {
        !startPressed &&
        <button className="startButton" onClick={isPressed}>
          Start Indexing
        </button>
      }

      {startPressed && notDeleted &&
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

          <button className="deleteButton" onClick={deleteInstance}>
            <FaMinusCircle />
          </button>
        </div>
      }
      {startPressed && !notDeleted &&
        <div>
          <p className="deleteText">
            <MdDelete className='deleteIcon' />
            Deleted
          </p>
        </div>
      }
    </>
  )
}

export default IndexerComponent
