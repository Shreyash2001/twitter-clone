import React, { useRef, useState } from "react";

const CameraCapture = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [response, setResponse] = useState(null);
  const [userCameraSelection, setUserCameraSelection] = useState("user");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Open the camera
  const startWebCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: userCameraSelection,
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam", error);
    }
  };

  const stopWebCam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
    }
  };

  // Capture a photo
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const video = videoRef.current;
      if (context && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg"); // Base64 image data
        setCapturedImage(imageData);
        stopWebCam();
      }
    }
  };

  const reset = () => {
    stopWebCam();
    setCapturedImage(null);
  };

  // Handle image upload
  const uploadImage = async () => {
    if (capturedImage) {
      const data = new FormData();
      const blob = await fetch(capturedImage).then((res) => res.blob());
      data.append("file", blob);
      data.append("upload_preset", "insta_clone");
      data.append("cloud_name", "cqn");

      fetch("https://api.cloudinary.com/v1_1/cqn/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then(async (uploadedData) => {
          console.log("Uploaded Image URL:", uploadedData.url);
          const backendRes = await fetch(
            "http://localhost:5001/get-image-details",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ url: uploadedData.url }),
            }
          );

          const backendData = await backendRes.json();
          setResponse(backendData);
          alert("Image uploaded successfully!");
        })
        .catch((err) => {
          console.error("Upload error:", err);
          alert("Failed to upload image.");
        });
    }
  };

  const handleCameraToggle = () => {
    setUserCameraSelection(
      userCameraSelection === "user" ? "environment" : "user"
    );
  };

  return (
    <div>
      <h2>Capture Photo</h2>
      {
        <div style={{ margin: "10px 0px" }}>
          <button onClick={handleCameraToggle}>Toggle Camera</button>
        </div>
      }
      {!capturedImage && <button onClick={startWebCam}>Open Camera</button>}

      {
        <div>
          <video ref={videoRef} autoPlay muted />
        </div>
      }
      <button onClick={capturePhoto}>Capture Photo</button>
      <button onClick={stopWebCam}>Close Camera</button>

      {capturedImage && (
        <div>
          <h3>Captured Photo:</h3>
          <img src={capturedImage} alt="Captured" style={{ width: "100%" }} />
          <button onClick={uploadImage}>Upload Photo</button>
          <button onClick={() => setCapturedImage(null)}>Retake Photo</button>
        </div>
      )}

      {/* Hidden canvas for capturing photo */}
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={640}
        height={480}
      />
      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
