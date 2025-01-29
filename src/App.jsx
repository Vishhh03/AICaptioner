import { useState } from "react";
import axios from "axios";

export default function VideoCaptioningApp() {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [captionUrl, setCaptionUrl] = useState(null);

  const handleFileChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const uploadVideo = async () => {
    if (!video) return alert("Please select a video");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", video);
    
    try {
      const response = await axios.post("http://your-ec2-public-ip:8000/caption", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCaptionUrl(response.data.srt_url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Automatic Video Captioning</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} className="mb-4" />
      <button onClick={uploadVideo} disabled={uploading} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
      {captionUrl && (
        <div className="mt-4 p-2 bg-white shadow rounded">
          <p>Download Caption:</p>
          <a href={captionUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            {captionUrl}
          </a>
        </div>
      )}
    </div>
  );
}
