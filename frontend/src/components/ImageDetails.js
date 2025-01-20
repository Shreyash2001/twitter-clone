import React, { useState } from "react";
import CameraCapture from "./CameraCapture";

const ImageDetails = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);

    try {
      // Upload image to Cloudinary
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "insta_clone"); // Replace with your Cloudinary upload preset
      data.append("cloud_name", "cqn"); // Replace with your Cloudinary cloud name

      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/cqn/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryData.url) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      // Use the Cloudinary URL in the backend API call
      const backendRes = await fetch(
        "http://localhost:5001/get-image-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: cloudinaryData.url }),
        }
      );

      const backendData = await backendRes.json();
      setResponse(backendData);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Get Image Details</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload and Analyze"}
        </button>
      </form>
      <CameraCapture />
      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ImageDetails;
