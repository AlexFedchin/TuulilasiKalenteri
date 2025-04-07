import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch("/api");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };
    fetchMessage();
  }, []);

  return (
    <div>
      <h2>Message from server:</h2>
      <p>{message}</p>
      <p>
        If you see this message, the server is running and the proxy is working!
      </p>
    </div>
  );
}

export default App;
