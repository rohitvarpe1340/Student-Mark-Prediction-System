Student-Internal-Marks-Prediction-System

Tech Stack
Angular | Node.js | MySQL | C++

Description
A full-stack application to predict students' internal marks using C++ ML logic integrated with Node.js backend and Angular frontend.

Folder Structure
frontend: Angular application
backend: Node.js REST APIs
cpp-ml: C++ prediction logic
database: MySQL schema
How It Works
User enters student data in Angular UI
Node.js API calls C++ logic using child process
Predicted marks returned and displayed
Frontend (Angular)
How to run:

npm install
ng serve
Backend (Node.js)
npm install
npm run dev
C++ ML Logic
Compile: g++ marks_prediction.cpp -o marks_prediction
