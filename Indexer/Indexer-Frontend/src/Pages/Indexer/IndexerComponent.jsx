import { useState, useRef, useEffect } from 'react'
import './Indexer.css'
import { FaMinusCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import source from "./Data/Source/Source.json"
import resource from "./Data/Resource/Resource.json"
import periodic from "./Data/Periodic/Periodic.json"

import { createClient} from '@supabase/supabase-js'

const supabase = createClient(
  "https://glswwzdfwzmbynmuuwhm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsc3d3emRmd3ptYnlubXV1d2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4ODI1ODQsImV4cCI6MjAyNjQ1ODU4NH0.V0Fs97rJCoA42jLIIIJ48Tp1nSUgktWvA5_cAhrNk3Q"
)

function IndexerComponent() {
  document.title = "KB-Indexer"
  const [startPressed, setStartPressed] = useState(false)
  const [sourceTypes, setSourceTypes] = useState(source.web)
  const [notDeleted, setnotDeleted] = useState(true)
  const [isPeriodic, setIsPeriodic] = useState(false)
  const [userID, setUserID] = useState('')
  const [status, setStatus] = useState('')
  const [apiUserId, setApiUserId] = useState('')
  const [authorized, isAuthorized] = useState(true)
  // ids

  const sourceID = "source" + userID
  const resourceID = "recourse" + userID
  const periodID =  "period" + userID

  const resourceRef = useRef(null);

  // Received data
  const [completionTime, setCompletionTime] = useState('0 Min')
  const [startTime, setStartTime] = useState('-')
  const [completed, setCompleted] = useState('No')

  useEffect(() => {
      supabase.auth.getUser().then(({data : {user}}) => {
        setApiUserId(user.id)

        console.log(user.id)
      })
    }
  )

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
      setSourceTypes(source.api);
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
    const endpoint = 'http://127.0.0.1:8080/indexer/1.0.0/job/' + userID + '/' + isPeriodic
    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        if (data.active == 1) {
          setStatus("Active")
        }
        else if (data.succeeded == 1) {
          setStatus("Succeeded")
        }
        else if (data.terminating == 1) {
          setStatus("Terminating")
        }
        else {
          setStatus("Failed")
        }
        console.log(data)
        setCompletionTime(data.completionTime),
        setStartTime(data.startTime),
        setCompleted(JSON.stringify(data.completed))
      })

      console.log(status)
  }

  // Delete instance
  function deleteData() {
    const endpoint = 'http://127.0.0.1:8080/indexer/1.0.0/job/' + userID + '/' + isPeriodic
    fetch(endpoint,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(
          {
            name: userID,
            periodic: isPeriodic
          }
        )
      }
    )
    .then(response => {console.log(response)})
  }

  // Send data API call
  const sendData = async () => {
    var source = document.getElementById(sourceID).value;
    var resource = document.getElementById(resourceID).value;
    var periodic = document.getElementById(periodID).value;
    var uID = new Date().toISOString().replace(/[-.:]/g, '').toLowerCase();
    setUserID(uID)

    var isResourceTypeOnly = (source == "noSourceType") ? true : false
    var isPeriodic = (periodic == "once") ? false : true
    setIsPeriodic(isPeriodic)

    const res = fetch(
      "http://127.0.0.1:8080/indexer/1.0.0/jobs",
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${apiUserId}`, 
        },
        body:JSON.stringify( 
          {
            "name": uID,
            "periodic": isPeriodic,
            "resourceType": resource,
            "resourceTypeOnly": isResourceTypeOnly,
            "sourceType": source,
            "timePeriod": periodic
          })
      }
    )
    .then(response => response.json())
    .then(data => {
      console.log(data)
      console.log(data.authorized)
      if(data.authorized == false) {
        isAuthorized(false)
      }
    })
  }

  return (
    <>
      <p className="instanceName"> Instance {userID}</p>
      <p className="resourceText">
        Resource type
      </p>
      <div className='resource' >
        <select className='select' id={resourceID} ref={resourceRef} onChange={selectSourceType}>
          {resource.map((o) => <option value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <p className="sourceText">
        Source type
      </p>
      <div className='source'>
        <select className='select' id={sourceID}>
          {
            sourceTypes.map((o) => <option value={o.value}>{o.label}</option>)
          }
        </select>
      </div>

      <p className="periodicText">
        Period
      </p>
      <div className='periodic'>
        <select className='select' id={periodID}>
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

      {startPressed && notDeleted && authorized &&
        <div>
          <button className="refreshButton" onClick={refresh}>
            Refresh
          </button>
          <p className="progressText">
            Start Time: {startTime} <br />
            Completion Time: {completionTime} <br />
            Status: {status} <br />
          </p>

          <button className="deleteButton" onClick={deleteInstance}>
            <FaMinusCircle />
          </button>
        </div>
      }
      {startPressed && !notDeleted && authorized &&
        <div>
          <p className="deleteText">
            <MdDelete className='deleteIcon' />
            Deleted
          </p>
        </div>
      }
      
      {authorized == false &&
        <div className='authText'>
          Not authorized!
        </div>
      }

    </>
  )
}

export default IndexerComponent
