import { Button, IconButton, Input, TextField } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useState } from "react";
import { storage, db } from "../firebase.config";
import firebase from "firebase";
import "../../src/image-upload.css";
import { PhotoCamera } from "@material-ui/icons";

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState();
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    console.log(e.target.files[0]);

    if (e.target.files[0] !== null) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    // add event listener for the state_changed event for the file upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress logic...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error function
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image in database
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="image-upload">
      <h3>Post something...</h3>
      <progress className="imageupload__progress" value={progress} max="100" />
      <TextField
        type="text"
        placeholder="Enter a caption..."
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
        className="imageupload__caption"
        variant="outlined"
      />

      <input
        type="file"
        onChange={handleChange}
        className="imageupload__file"
      />

      <Button
        onClick={handleUpload}
        className="imageupload__button"
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
      >
        Upload
      </Button>
    </div>
  );
};

export default ImageUpload;
