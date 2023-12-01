import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function LoginForm({ onLoginSuccess }) {
  const [warn, setwarn] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email_id, password } = e.target.elements;

    const formDataObject = {
      email_id: email_id.value,
      password: password.value,
    };

    const jsonData = JSON.stringify(formDataObject);

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });

      if (res.status === 401) {
        setwarn("Incorrect email Id or password");
        return;
      }

      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      onLoginSuccess(data.accessToken);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email_id" required />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />
      </div>
      <h3 style={{ color: "red" }}>{warn}</h3>
      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;
