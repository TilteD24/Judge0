import React, { useState, useEffect } from "react";
import "./index.css";

async function fetchSubmissions() {
  try {
    const res = await fetch("http://localhost:5000/submissions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const data = await res.json();
    return data.submissions;
  } catch (e) {
    console.log(e);
  }
}

function Submissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions().then((data) => setSubmissions(data));
  });

  return (
    <>
      <table>
        <tr>
          <th>#</th>
          <th>Problem</th>
          <th>Language</th>
          <th>Verdict</th>
        </tr>
        {submissions &&
          submissions.map((submission, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{submission.problem_title}</td>
                <td>{submission.lang}</td>
                <td>
                  {submission.verdict === "Accepted" ? (
                    <p style={{ color: "green" }}>Accepted</p>
                  ) : (
                    <p style={{ color: "red" }}>Wrong Answer</p>
                  )}
                </td>
              </tr>
            );
          })}
      </table>
    </>
  );
}

export default Submissions;
