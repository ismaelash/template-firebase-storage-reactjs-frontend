import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import * as FirebaseController from "./components/firebaseController";

function App() {
  const [progress, setProgress] = useState(0);
  const [startUpload, setStartUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [pathOnStorage, setPathOnStorage] = useState("");
  const [filename, setFilename] = useState("");
  const [urlFile, setUrlFile] = useState("");

  function onButtonUploadSimpleClicked() {
    if (file) {
      setStartUpload(true);
      console.log("Upload file", file);

      FirebaseController.uploadFile("simple/", file, (error, url) => {
        if (error) {
          console.error(error);
          return;
        }

        console.log("URL DOWNLOAD", url);
        setProgress(100);
      });
    } else {
      alert("choose any file");
    }
  }

  function onButtonUploadWithProgressClicked() {
    if (file) {
      setStartUpload(true);
      console.log("Upload file", file);

      FirebaseController.uploadFileWithProgress(
        "withProgress/",
        file,
        (state, progress) => {
          console.log("upload state", state);
          setProgress(progress);
        },
        (error) => {
          console.error(error);
        },
        (url) => {
          console.log("Upload success, url", url);
        }
      );
    } else {
      alert("choose any file");
    }
  }

  async function OnButtonDonwloadUrlClicked() {
    const URL = await FirebaseController.getFileUrl(pathOnStorage, filename);
    setUrlFile(URL);
  }

  async function OnButtonDonwloaFileClicked() {
    await FirebaseController.downloadFile(pathOnStorage, filename);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Upload Area</h3>
        <div>
          <input
            type="file"
            onChange={(event) => setFile(event.target.files[0])}
          />
          <br />
          <button onClick={onButtonUploadSimpleClicked}>
            Upload file - simple
          </button>
          <br />
          <button onClick={onButtonUploadWithProgressClicked}>
            Upload file - progress
          </button>
        </div>
        {startUpload && <div className="progress">Progress: {progress}%</div>}
        <h3>Download Area</h3>
        <div>
          <span>pathOnStorage: </span>
          <input
            type="text"
            placeholder="folder/"
            onChange={(event) => setPathOnStorage(event.target.value)}
          />
          <br />
          <span>filename: </span>
          <input
            type="text"
            placeholder="name.extension"
            onChange={(event) => setFilename(event.target.value)}
          />
          <br />
          <button onClick={OnButtonDonwloadUrlClicked}>Download - url</button>
          <br />
          <button onClick={OnButtonDonwloaFileClicked}>Download - file</button>
        </div>
        {urlFile && <div className="progress">Url File: {urlFile}</div>}
      </header>
    </div>
  );
}

export default App;
