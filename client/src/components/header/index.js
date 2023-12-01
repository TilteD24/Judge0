import React, { useState, useEffect } from "react";
import banner from "./banner.png";
import "./index.css";

function Header({ accessToken, imageLoaded, onImageLoad }) {
  const [username, setUsername] = useState(null);

  const logoutHandler = () => {
    setUsername(null);
    localStorage.removeItem("accessToken");
  };

  const logoutBtn = <a onClick={logoutHandler}>Logout</a>;
  const registerBtn = <a href="/register">Register</a>;
  const loginBtn = <a href="/login">Login</a>;
  const emptyBtn = <a>{username}</a>;
  const submissionsBtn = <a href="/submissions">Submissions</a>;

  useEffect(() => {
    if (accessToken) {
      fetch("http://localhost:5000/login", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setUsername(res.username);
        });
    }
  }, [accessToken]);
  
  return (
    <>
      <div id="header" style={{ position: "relative" }}>
        <div style={{ float: "left", maxHeight: "90px" }}>
          <a href="/">
            <img
              src={banner}
              alt="Judge0"
              style={{ height: "100px" }}
              onLoad={() => onImageLoad(true)}
            />
          </a>
        </div>
        {imageLoaded && (
          <div className="userlogin">
            <div>
              {username ? <>{emptyBtn} |{" "}{logoutBtn} |{" "}{submissionsBtn}</> : <>{loginBtn} |{" "}{registerBtn}</>}

            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
