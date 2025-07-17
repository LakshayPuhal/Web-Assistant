import { useState } from "react";
import axios from "axios";

const VoiceAssistant = () => {
  const [response, setResponse] = useState("");

  const getTime = async () => {
    const { data } = await axios.get("http://localhost:5000/api/time");
    setResponse(`Current time: ${data.time}`);
  };

  const getDate = async () => {
    const { data } = await axios.get("http://localhost:5000/api/date");
    setResponse(`Today's date: ${data.date}`);
  };

  const openWebsite = async () => {
    const siteName = prompt("Enter website name:");
    if (!siteName) return;
    const { data } = await axios.post("http://localhost:5000/api/open-website", { siteName });
    setResponse(`Website content: ${data.content}`);
  };

  const fillGoogleForm = async () => {
    const { data } = await axios.post("http://localhost:5000/api/fill-google-form");
    setResponse(`Google form content: ${data.formContent}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Voice Assistant</h1>
      <div className="flex flex-wrap gap-4">
        <button onClick={getTime} className="px-4 py-2 bg-blue-500 rounded-lg">Get Time</button>
        <button onClick={getDate} className="px-4 py-2 bg-green-500 rounded-lg">Get Date</button>
        <button onClick={openWebsite} className="px-4 py-2 bg-yellow-500 rounded-lg">Open Website</button>
        <button onClick={fillGoogleForm} className="px-4 py-2 bg-red-500 rounded-lg">Fill Google Form</button>
      </div>
      {response && <p className="mt-4">{response}</p>}
    </div>
  );
};

export default VoiceAssistant;
