// https://firebase.google.com/docs/storage/web/upload-files#upload_files

import * as FirebaseApp from "firebase/app";
import * as FirebaseStorage from "firebase/storage";

const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

FirebaseApp.initializeApp(FIREBASE_CONFIG);

const STORAGE = FirebaseStorage.getStorage();

export function uploadFile(pathOnStorage, file, callback) {
  const FILE_REF = FirebaseStorage.ref(STORAGE, `${pathOnStorage}${file.name}`);

  FirebaseStorage.uploadBytes(FILE_REF, file)
    .then((uploadResult) => {
      console.log("Upload success", uploadResult.ref);
      callback(null, uploadResult.ref);
    })
    .catch((error) => {
      console.error("Upload error", error);
      callback(error, null);
    });
}

export function uploadFileWithProgress(
  pathOnStorage,
  file,
  callbackProgress,
  callbackError,
  callbackSuccess
) {
  const FILE_REF = FirebaseStorage.ref(STORAGE, `${pathOnStorage}${file.name}`);

  const UPLOAD_TASK = FirebaseStorage.uploadBytesResumable(FILE_REF, file);

  UPLOAD_TASK.on(
    "state_changed",
    (snapshot) => {
      const PROGRESS = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      callbackProgress(snapshot.state, Math.round(PROGRESS));
    },
    (error) => {
      // https://firebase.google.com/docs/storage/web/handle-errors
      // error.code
      callbackError(error);
    },
    async () => {
      const FILE_URL = await FirebaseStorage.getDownloadURL(
        UPLOAD_TASK.snapshot.ref
      );
      callbackSuccess(FILE_URL);
    }
  );
}

export async function getFileUrl(pathOnStorage, filename) {
  const FILE_REF = FirebaseStorage.ref(STORAGE, `${pathOnStorage}${filename}`);

  const URL = await FirebaseStorage.getDownloadURL(FILE_REF);
  return URL;
}

export async function downloadFile(pathOnStorage, filename) {
  const FILE_REF = FirebaseStorage.ref(STORAGE, `${pathOnStorage}${filename}`);
  const URL = await FirebaseStorage.getDownloadURL(FILE_REF);

  const A = document.createElement("a");
  A.href = URL;
  A.target = "_blank";
  A.click();
  A.remove();
}
