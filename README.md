![TuulilasiKalenteri Logo](./client/public/logo.webp)

# TuulilasiKalenteri Application

The **TuulilasiKalenteri Application** is a comprehensive tool designed to help the TuulilasiPojat franchise manage bookings, orders, and notes efficiently. It features a React-based frontend and a Node.js backend, providing a seamless user experience for administrators and regular users alike.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [License](#license)
- [Read More](#read-more)

## Features

- **User Management**: Admins can manage users, including roles and locations.
- **Booking System**: Manage bookings and orders with ease.
- **Notes Management**: Create, update, and delete notes with a rich UI.
- **Localization**: Supports multiple languages (English, Finnish, Russian).
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices.
- **Authentication**: Secure login and role-based access control.
- **Email Notifications**: Sends welcome emails and other notifications.

## Technologies Used

### Frontend

- **React**: Component-based UI library.
- **Vite**: Fast development server and build tool.
- **Material-UI**: UI components for a modern design.
- **React Router**: Client-side routing.
- **i18next**: Internationalization and localization.
- **Notistack**: Snackbar notifications.

### Backend

- **Node.js**: JavaScript runtime.
- **Express**: Web framework for building APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB.
- **Joi**: Data validation.
- **dotenv**: Environment variable management.

## Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **MongoDB** (local or cloud instance)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/TuulilasiPojat.git
   cd TuulilasiPojat
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

## Running the Application

### Backend

1. Create a `.env` file in the `server/` directory with the required environment variables (read more in [Environment Variables](./server/README.md#environment-variables)).

2. Start the backend server:

   ```bash
   cd server
   npm run dev
   ```

### Frontend

1.  Start the frontend development server:

    ```bash
    cd client
    npm run dev
    ```

2.  Open the application in your browser at http://localhost:5173.

### Both at the same time

The application has a `concurrently` dependency installed and a script configured, so you can also run both frontend and backend at the same time by running `npm run dev` from the root of the repository.

## License

This project is licensed under the MIT License.

## Read More

- [Frontend README](./client/README.md)
- [Backend README](./server/README.md)
