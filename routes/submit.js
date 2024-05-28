const express = require("express");
const router = express.Router();
const languageModel = require("../models/language");
const submissionModel = require("../models/submission");
const { spawn } = require("child_process");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const extensions = {
  "C++": "cpp",
  Java: "java",
  Python: "py",
};

function compile(code, input, lang, callback) {
  console.log(input);
  const fileName = `code.${extensions[lang]}`;
  const filePath = path.join(__dirname, fileName);
  const outputExecutable = path.join(__dirname, "file");

  const languageDetails = {
    "C++": {
      command: "g++",
      parameters: ["-o", "file", fileName],
      exec: { command: "./file", parameters: [] },
    },
    Java: {
      command: "javac",
      parameters: [fileName],
      exec: { command: "java", parameters: ["Solve"] },
    },
    Python: { command: "python", parameters: [fileName] },
  };

  fs.writeFile(fileName, code, (error) => {
    if (error) {
      console.log(`Failed to create c file : ${error}`);
      callback(error);
      return;
    }

    const childProcess = spawn(
      languageDetails[lang].command,
      languageDetails[lang].parameters
    );

    childProcess.stderr.on("data", (data) => {
      console.error(`Failed to compile: ${data}`);
      callback(data.toString());
    });

    childProcess.on("exit", (code, signal) => {
      if (code === 0) {
        console.log("Compiled Successfully");

        const userCodeProcess = spawn(
          languageDetails[lang].exec.command,
          languageDetails[lang].exec.parameters
        );

        userCodeProcess.stdin.write(input);
        userCodeProcess.stdin.end();

        let output = "";
        let errorOutput = "";
        userCodeProcess.stdout.on("data", (data) => {
          //console.log(data);
          output = data.toString();
        });

        userCodeProcess.stderr.on("data", (data) => {
          errorOutput += data.toString();
        });

        userCodeProcess.on("error", (err) => {
          callback(err);
        });

        userCodeProcess.on("exit", () => {
          console.log("User code execution completed");
          if (errorOutput) {
            callback(new Error(errorOutput));
          } else callback(null, output);
        });
      }
    });
  });
}

function deleteFiles(lang) {
  fs.unlink(`.\\code.${extensions[lang]}`, (err) => {
    if (err) {
      console.log(`Failed to delete the cpp file : ${err}`);
    }
  });
  fs.unlink(".\\file.exe", (err) => {
    if (err) {
      console.log(`Failed to delete the exe file : ${err}`);
    }
  });
}

router
  .get("/", async (req, res) => {
    try {
      const languages = await languageModel.find({});
      res.status(201).json({ languages: languages });
    } catch (e) {
      res.status(500).json({ error: "Failed to send languages" });
    }
  })
  .post("/", authenticateToken, async (req, res) => {
    try {
      const problem = req.body.problem;
      let input = `${problem.test_cases.length} `;

      problem.test_cases.map((test_case) =>
        Object.entries(test_case.parameters).forEach(([key, value]) => {
          input += value + " ";
        })
      );

      compile(req.body.code, input, req.body.lang, async (err, output) => {
        if (err) res.status(201).json({ error: err.message });
        else {
          deleteFiles(req.body.lang);

          const answers = output.split(/\r?\n/g);

          let outputMessage = "";

          for (let i = 0; i < answers.length - 1; i++) {
            if (Number(answers[i]) !== problem.test_cases[i].answer) {
              outputMessage = `Test case ${i + 1} failed:\n${Object.entries(
                problem.test_cases[i].parameters
              )
                .map(([key, value]) => `${key} = ${value}`)
                .join(", ")}\n`;
              outputMessage += `Expected answer = ${problem.test_cases[i].answer}\n`;
              outputMessage += `Output = ${answers[i]}`;
              break;
            }
          }

          const submission = await submissionModel.create({
            email_id: req.user.email_id,
            problem_title: problem.title,
            lang: req.body.lang,
            verdict: outputMessage ? "Wrong Answer" : "Accepted",
          });

          res
            .status(201)
            .json({ output: output, outputMessage: outputMessage });
        }
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
/*
#include <bits/stdc++.h>
using namespace std;

void solve(){
    int a, b;
    cin >> a >> b;
    cout << a-b << endl;
    
}

int main(){
    int t;
    cin >> t;
    
    while(t--){
        solve();
    }
    return 0;
    
}

import java.util.*;
import java.lang.*;
import java.io.*;

class Solve
{
    static void solve(Scanner sc){
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        System.out.println(a+b);
    }
    
	public static void main (String[] args) throws java.lang.Exception
	{
		Scanner sc = new Scanner(System.in);
		
		int t = sc.nextInt();
		
		while(t-- > 0){
		    solve(sc);
		}
		
		sc.close();
		
	}
}
*/
