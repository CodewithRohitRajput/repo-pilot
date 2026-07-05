# 🚀 RepoPilot

RepoPilot is an event-driven GitHub automation platform that connects with a user's GitHub repositories, listens for repository events using GitHub Webhooks, and automatically performs actions such as labeling issues and sending Slack notifications based on configurable automation rules.

---

# Features

- 🔐 GitHub OAuth Authentication
- 📦 Connect GitHub repositories
- 🔗 Automatic GitHub Webhook creation
- 📩 Receive GitHub webhook events
- 📝 Store webhook events in MongoDB
- 🏷️ Automatically add labels to GitHub Issues
- 💬 Send Slack notifications
- ⚙️ User configurable automation rules
- 📊 Dashboard showing connected repositories and activity logs

---

# Tech Stack

## Frontend

- Next.js
- React
- Tailwind CSS
- Fetch API

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication

## Third Party Services

- GitHub OAuth
- GitHub REST API
- GitHub Webhooks
- Slack Incoming Webhooks

---

# Folder Structure

```
client/
server/
```

---

# Environment Variables

Create a `.env` file inside the server.

```
PORT=
MONGODB_URI=
JWT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=

GITHUB_WEBHOOK_SECRET=

SLACK_WEBHOOK_URL=

FRONTEND_URL=
```

---

# Running Locally

## Backend

```bash
cd server
npm install
npm run dev
```

## Frontend

```bash
cd client
npm install
npm run dev
```

---

# Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

---

# Webhook Flow

```
GitHub Issue

↓

GitHub Webhook

↓

Express Webhook Endpoint

↓

Store Event

↓

Read User Rule

↓

Add GitHub Label

↓

Send Slack Notification

↓

Display Event on Dashboard
```

---

# Future Improvements

- Multiple Rules per User
- GitHub App Authentication
- Retry Failed Events
- AI Issue Classification
- Per Repository Rules

---

# Author

Rohit Singh Rajput