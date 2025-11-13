import { useEffect } from "react";
import "./App.css";

function App() {
 
  useEffect(() => {
    console.log("hitting system api")
    const sub = window.electronAPI.subscribeStatistics((stats) => console.log("stats", stats))
    return sub;
  }, [])

  return (
    <>
      Hey There
    </>
  );
}

export default App;
