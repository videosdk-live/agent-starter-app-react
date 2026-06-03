# Agent Starter React (VideoSDK)

A React starter template for building real-time conversational AI agents using VideoSDK.

## Features

- **Voice & Video Support:** Real-time audio and video communication.
- **AI Agent Integration:** Interact with an AI agent with real-time responses.
- **Live Transcription:** Display ongoing conversation transcripts.
- **Screen Sharing:** Share your screen during sessions.
- **Device Management:** Switch between audio and video input/output devices.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)


## Getting Started

Use the following steps to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/videosdk-live/agent-starter-app-react.git
cd agent-starter-react
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory by copying the example:
```bash
cp .env.example .env
```

Update the `.env` file with the following values:

```env
AUTH_TOKEN=your_videosdk_auth_token
AGENT_ID=your_agent_id
MEETING_ID=your_meeting_id (optional)
VERSION_ID=your_version_id (optional)
```

### 4. How to access these `.env` Credentials?

| Token/ID     | Where to Find it |
| ------------ | ------------------------------------ |
| `AUTH_TOKEN` | Navigate to [VideoSDK's Dashboard](https://app.videosdk.live/) > API Keys > Clicking on '🔑' icon <br> | 
| `AGENT_ID`   | VideoSDK's Dashboard > `Agent` Tab > `Agents` > Choose your preferred agent <br> | 
| `VERSION_ID` | Commit changes to the selected agent and deploy. Now click on the three dots (`...`) at the top-right corner > `View Deployments` > and copy the version. <br> | 

### 5. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.


## Configuration

| Variable | Description | Required |
|----------|------------|----------|
| `AUTH_TOKEN` | VideoSDK authorization token | Yes |
| `AGENT_ID` | ID of the AI agent to connect with | Yes |
| `MEETING_ID` | Meeting ID to join (optional) | No |
| `VERSION_ID` | Version ID of the AI agent (optional) | No |

---
<p align="center">
  Built with ❤️ by <a href="https://www.videosdk.live/">VideoSDK</a>
</p>
