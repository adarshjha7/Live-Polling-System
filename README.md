# 🗳️ Live Poll Studio

**Live Poll Studio** is a real-time classroom polling system built with React and Socket.IO. It allows teachers to conduct live polls, and students to respond interactively in real-time, with full session-based participation and result visualization.

---

## 🔗 Live Project

[🔗 https://live-polling-system-ifbp.vercel.app/](https://live-polling-system-ifbp.vercel.app/)


---
##  Run Locally

Follow these steps to run the project on your local machine:

### 1. Clone the repository and start the app

```bash
git clone https://github.com/adarshjha7/Live-Polling-System.git
cd Live-Polling-System
npm install
npm run dev
```
---

## 👨‍🏫 Teacher Features

* Create and launch new polls.
* View live poll results in real time.
* Restrict asking a new question until:

  * All students have responded, or
  * There is no active question.
* Set custom time limits per question (e.g., 60 seconds).
* Remove/kick specific students during the session.
* Access poll history (previous polls with results).
* **Interact directly with students via an in-app chat interface**.

---

## 🎓 Student Features

* Join by entering a name (unique to the current browser tab).

  * Opening a new tab allows joining again as a new student.
  * Refreshing the tab retains the session identity.
* Receive questions in real time and submit answers.
* Automatically see live results after submitting or after timeout.
* Each question must be answered within a 60-second window.
* **Chat live with the teacher** during the session.

---

## ✅ Summary of Implemented Features

### Core Functionality

* [x] Real-time poll system with socket-based syncing.
* [x] Role-based access: Teacher & Students.
* [x] Poll creation, answering, and result tracking.
* [x] Hosted full-stack solution (frontend + backend).

### Enhanced Features

* [x] Teacher-controlled time limits per question.
* [x] Kick out any student from the session.
* [x] View historical poll results (persisted, not localStorage-based).
* [x] **In-app teacher–student chat for real-time interaction**.

---

## 🖼️ Screenshots

![Screenshot (72)](https://github.com/user-attachments/assets/2c2e1c74-6756-401e-a97f-561feeb86bee)
![Screenshot (73)](https://github.com/user-attachments/assets/d5a6c73b-4415-474e-b958-6b3a9ce1d479)
![Screenshot (74)](https://github.com/user-attachments/assets/0db79005-a34c-4807-9ee3-1af946135bb1)

![Screenshot (75)](https://github.com/user-attachments/assets/9c0517b7-5304-4499-a729-78d433c192a1)!
[Screenshot (76)](https://github.com/user-attachments/assets/39be0caa-c6ab-449d-a189-6e3e6613a435)
![Screenshot (77)](https://github.com/user-attachments/assets/a0a7413f-9801-41bc-97a3-ded2d9c25544)
![Screenshot (78)](https://github.com/user-attachments/assets/9c9ae895-8c6d-48fe-9f96-7fbf046d9f07)
![Screenshot (79)](https://github.com/user-attachments/assets/98e34bb0-5ea2-4612-86ed-6ac886c56421)

![Screenshot (81)](https://github.com/user-attachments/assets/f6f4e450-7a6c-42ef-9e68-da7c2145d5d1)



