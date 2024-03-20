import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import "./Ongoing.css";

function Ongoing() {
  let navigate = useNavigate();
  const [allJobs, setAllJobs] = useState("");

  function retrieveData() {
    fetch("/api/indexer/1.0.0/jobs")
      .then(response => response.json())
      .then(data => {
        setAllJobs(JSON.stringify(data, null, 2));
      });
  }

  useEffect(() => {
    document.title = "Sign in to KB-Indexer";
    retrieveData();
  });

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Vite logo" />
      </div>
      <p className="ongoingText"> Ongoing instances:</p>
      <button className="ongoing" onClick={() => navigate(-1)}>
        Go back
      </button>
      <pre className="output">{allJobs}</pre>
    </>
  );
}

export default Ongoing;
