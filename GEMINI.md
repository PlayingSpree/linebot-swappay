# GEMINI.md - Project Context for `linebot-swappay`

## Project Overview
`linebot-swappay` is a simple Line Bot designed to track a running balance ("amount") through text messages. It allows users to send numeric or basic arithmetic expressions, which are then calculated and added to a persistent total stored in a lightweight database.

### Core Technologies
- **Runtime:** Node.js (v20 in Docker)
- **Framework:** [Express](https://expressjs.com/) for the web server and webhook.
- **Database:** [Enmap](https://enmap.evie.dev/) for simple, file-based persistent storage.
- **Platform:** Local Unraid (Docker) or [Fly.io](https://fly.io/) for deployment.

---

## Building and Running

### Prerequisites
- [Node.js](https://nodejs.org/) (Recommended: v20+)
- A Line Messaging API Channel.

### Commands
- **Install dependencies:** `npm install`
- **Start the application:** `npm start`
- **Deployment (Fly.io):** `fly deploy`

### Environment Variables
The following environment variables are required for the application to function correctly:
- `LINE_ACCESS_TOKEN`: The Channel Access Token from the Line Developers Console.
- `PORT`: (Optional) The port on which the Express server listens (defaults to `3000`).

---

## Architecture and Development Conventions

### Main Components
- `index.js`: The main entry point. Sets up the Express server, handles the `/webhook` endpoint, and contains the message processing logic.
- `db.js`: A simple database abstraction layer using Enmap to read and write the "amount" value.
- `Dockerfile`: Multi-stage build for production-ready deployment.
- `fly.toml`: Configuration for Fly.io, including region (`sin`) and persistent mounts for the data directory.

### Key Logic
- **Webhook Handling:** Listens for `POST` requests at `/webhook`. It specifically looks for text messages.
- **Input Parsing:** Uses a regular expression `/[^0-9\+\-\*\/\.]/g` to sanitize the input text, stripping away non-numeric and non-arithmetic characters.
- **Calculation:** The sanitized string is evaluated using `eval()` to allow users to send simple expressions (e.g., "10 + 5").
- **Persistence:** The data is stored in the `./data` directory, which is mounted as a persistent volume in Fly.io to ensure data survives restarts.

### Style and Practices
- Simple, procedural logic within `index.js` for message handling.
- Basic error handling in `db.js` using try-catch blocks.
- Logging is handled via `console.log`.
