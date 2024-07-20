# Community
# Local Community Assistance Platform

This is a full-stack web application designed to facilitate local community assistance by connecting people in need of help with those willing to offer assistance. 
Users can register, login, make requests for help, offer assistance, send messages, and provide reviews. The application is built using SQL Server, Node.js, Express.js, React, and Redux.

## Features

- User registration and login
- Create and view requests for assistance
- Create and view offers to provide assistance
- Send and receive messages between users
- View and provide reviews for assistance received
- Real-time updates for new messages and requests
- Responsive design for accessibility on various devices

## Technologies Used

### Backend

- SQL Server for database management
- Node.js
- Express.js for creating the server and API endpoints
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing

### Frontend

- React for building the user interface
- Redux for state management
- React Router for client-side routing
- Axios for HTTP requests
- CSS and bootstrap for styling



### Prerequisites

- Node.js (v12 or later)
- SQL Server

### Configuration

1. Create a `.env` file in the `backend` directory and add the following environment variables:
   ```plaintext
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_secret_key_for_jwt
   DB_SERVER=your server name
DB_NAME=name of the database
DB_USER=username of the database
DB_PASSWORD=database password
DB_ENCRYPT=false
