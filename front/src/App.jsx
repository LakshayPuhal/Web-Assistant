import React, { useState, useRef } from "react";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setTranscript(transcript);
        handleCommand(transcript.toLowerCase());
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error("Speech recognition not supported:", error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleCommand = async (command) => {
    setIsLoading(true);
    try {
      if (command.includes("what is the time")) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        setResponse(`The current time is ${timeString}`);
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error sending command:", error);
      setResponse("Error processing command. Please make sure the backend server is running.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Voice Automation Assistant</h1>
            <p className="text-lg text-gray-300">
              Your personal voice-controlled assistant
            </p>
          </header>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <div className="flex justify-center mb-8">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`relative p-8 rounded-full transition-all duration-300 ${
                  isListening ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                {isListening && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-75"></span>
                )}
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-black/20 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-gray-300 mb-2">Transcript</h2>
                <p className="text-lg">{transcript || "Start speaking..."}</p>
              </div>

              <div className="bg-black/20 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-gray-300 mb-2">Response</h2>
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-blue-400" />
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <p className="text-lg">{response || "Waiting for command..."}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-400">
              <h3 className="font-semibold mb-2">Available Commands:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>"What is the time?"</li>
                <li>"What is the date?"</li>
                <li>"Search website [name]"</li>
                <li>"Open Google form"</li>
                <li>Say "stop" to end the session</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
