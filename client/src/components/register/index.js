import React from "react";
import { useNavigate } from "react-router-dom";

function Register({ setAccessToken }) {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = e.target.elements;
    const submitData = {
      username: username.value,
      email: email.value,
      password: password.value,
    };

    const jsonData = JSON.stringify(submitData)

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    });

    const data = await res.json();

    if (res.status === 201) {
      setAccessToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken)
      navigate("/");
    }
  };

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
}

export default Register;
