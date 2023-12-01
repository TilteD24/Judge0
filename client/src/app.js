import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Header from "./components/header/index";
import "./app.css";
import Login from "./components/login/login";
import Solve from "./components/solve";
import Submissions from "./components/submissions";
import Register from "./components/register";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [problems, setProblems] = useState([]);

  const fetchProblems = async () => {
    try {
      const res = await fetch("http://localhost:5000/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const problems = await res.json();
      return problems;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    fetchProblems().then((data) => setProblems(data));
  }, []);

  return (
    <>
      {!imageLoaded && <div className="loading-spinner">Loading...</div>}
      <div id="body">
        <Router>
          <Header
            accessToken={accessToken}
            onImageLoad={setImageLoaded}
            imageLoaded={imageLoaded}
          />
          {imageLoaded && (
            <Routes>
              <Route path="/" element={<Home problems={problems} />}></Route>
              <Route
                path="/login"
                element={<Login onLoginSuccess={setAccessToken} />}
              ></Route>
              <Route
                path="/solve/:problemId"
                element={<Solve problems={problems} />}
              ></Route>
              <Route path="/submissions" element={<Submissions />}></Route>
              <Route
                path="/register"
                element={<Register setAccessToken={setAccessToken} />}
              ></Route>
            </Routes>
          )}
        </Router>
      </div>
    </>
  );
}

export default App;
