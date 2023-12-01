import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AceEditor from "react-ace";
import "./index.css";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

async function fetchLanguages() {
  try {
    const res = await fetch("http://localhost:5000/submit", {
      method: "GET",
      headers: { "Content-Type": "Apllication/json" },
    });

    if (res.status === 201) {
      const data = await res.json();
      return data.languages;
    }
  } catch (e) {
    console.log(e);
  }
}

function Solve({ problems }) {
  const [languages, setLanguages] = useState([]);
  const [code, setCode] = useState("");
  //const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [output, setOutput] = useState(null);
  const [compiling, setCompiling] = useState(false);
  const { problemId } = useParams();
  const [warning, setWarning] = useState("");
  const problem = problems.find((problem) => problem.pid === Number(problemId));

  useEffect(() => {
    fetchLanguages().then((data) => setLanguages(data));
  }, []);

  useEffect(() => {
    if (languages.length > 0) {
      handleLanguageChange({ target: { value: languages[0].name } });
    }
  }, [languages]);

  const handleLineChange = (newValue) => {
    setCode(newValue);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = languages.find(
      (language) => language.name === e.target.value
    );
    if (selectedLanguage) setCode(selectedLanguage.template);
    else setCode("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    if (accessToken === null) {
      setWarning("Please login first.");
      return;
    }
    setCompiling(true);
    const formData = new FormData(e.target);

    const submitData = {
      problem: problem,
      lang: formData.get("languageId"),
      code: code,
    };
    const submitDataObject = JSON.stringify(submitData);
    //console.log(submitDataObject);
    try {
      const res = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: submitDataObject,
      });

      const data = await res.json();

      if (res.status === 500) {
        setOutput(`Error!\n${data.error}`);
        setCompiling(false);
      } else if (res.status === 201) {
        if (data.error) setOutput(`Error!\n${data.error}`);
        else if (data.outputMessage === "")
          setOutput(`All test cases passed!\n${data.output}`);
        else setOutput(data.outputMessage);
        setCompiling(false);
      }
    } catch (e) {
      console.log(e.error);
    }
  };

  if (!problem) {
    return <h1>Problem with id {problemId} not found...</h1>;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <table className="table-form">
          <tr>
            <td className="field-name">Problem:</td>
            <td>{problem.title}</td>
          </tr>
          <tr>
            <td className="field-name">Description:</td>
            <td>{problem.description}</td>
          </tr>
          <tr>
            <td className="field-name">Test Cases:</td>
            <td>
              <ol>
                {problem.test_cases.map((test_case) => (
                  <li>
                    {Object.entries(test_case.parameters).map(
                      ([key, value]) => `${key} = ${value} `
                    )}
                  </li>
                ))}
              </ol>
            </td>
          </tr>
          <tr>
            <td className="field-name">Language:</td>
            <td>
              <select
                style={{ width: "300px" }}
                name="languageId"
                onChange={handleLanguageChange}
              >
                {languages &&
                  languages.map((language) => (
                    <option key={language._id} value={language.name}>
                      {language.name}
                    </option>
                  ))}
              </select>
            </td>
          </tr>
          <tr>
            <td className="field-name">Source code:</td>
            <td style={{ paddingBottom: "0.7em" }}>
              <AceEditor
                mode={"c_cpp"}
                value={code}
                theme="github"
                name="ace_editor"
                onChange={handleLineChange}
                editorProps={{ $blockScrolling: true }}
              ></AceEditor>
            </td>
          </tr>

          <tr>
            <td className="field_name"></td>
            <td style={{ color: "red", textAlign: "center" }}>{warning}</td>
          </tr>

          <tr>
            <td className="field-name"></td>
            <td>
              <button type="submit">Submit</button>
            </td>
          </tr>
          {compiling ? (
            "Compiling..."
          ) : (
            <tr>
              <td className="field-name" style={{ verticalAlign: "top" }}>
                Output:
              </td>
              <td>
                <pre className="output-box">{output}</pre>
              </td>
            </tr>
          )}
        </table>
      </form>
    </>
  );
}

export default Solve;
