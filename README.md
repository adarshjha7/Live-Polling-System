# 🗳️ Live Poll Studio

**Live Poll Studio** is a real-time classroom polling system built with React and Socket.IO. It allows teachers to conduct live polls, and students to respond interactively in real-time, with full session-based participation and result visualization.

---

## 🔗 Live Project

[🔗 https://live-polling-system-ifbp.vercel.app/](https://live-polling-system-ifbp.vercel.app/)


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


---
