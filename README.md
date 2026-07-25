# Simple Blog Management System

A decoupled full-stack web application built as part of a 14-day internship task.

## Architecture & Deployment Note
This repository contains a full **Node.js/Express REST API** (backend) and a **Vanilla JS/HTML/CSS** client (frontend). 

To provide a seamless, interactive live demo for evaluators without causing shared-database conflicts, the live GitHub Pages deployment has been intentionally configured to use **Browser `localStorage`** for isolated state management. This ensures that any data you add or delete during testing remains completely isolated to your browser session.

**[View the Live Demo Here](https://yash23050.github.io/Intern-Task-1/)**

To experience the true decoupled REST API functionality, clone the repository and run it locally:
1. `npm install`
2. `node index.js`
3. Visit `http://localhost:3000`