# How to Run the Project

## 1) Install Prerequisites

- Node.js LTS
- Git (optional)
- Visual Studio Code, WebStorm or IntelliJ (optional)

## 2) Configure Environment Variables

For local execution, create a `.env` file in the project root and define:

- MONGODB_URI
- PORT_USERS
- PORT_COSTS
- PORT_LOGS
- PORT_ADMIN
- TEAM_MEMBERS

For the deployed services, the required environment variables are configured directly in Render.

## 3) Install Dependencies

npm install

## 4) Run the Services Locally

Open four terminals and run:

npm run start:users

npm run start:costs

npm run start:logs

npm run start:admin

## 5) Run Demo Requests

Open `demo.http` and run the HTTP requests against the deployed services.

## 6) Run Tests

Make sure all four services are running, then run:

npm test