![TuulilasiKalenteri Logo](./public/logo.webp)

# TuulilasiKalenteri Frontend

This is the frontend for the **TuulilasiKalenteri** web application.

## Technologies

- **React**: Component-based UI library.
- **Vite**: Fast development server and build tool.
- **Material-UI**: UI components for a modern design.
- **React Router**: Client-side routing.
- **i18next**: Internationalization and localization.
- **Notistack**: Snackbar notifications.

## Frontend Structure

```text
client/
├── public/         # Static assets (e.g., images, icons)
├── src/            # Source code
│   ├── components/ # Reusable React components
│   ├── context/    # Context API for global state management
│   ├── hooks/      # Custom React hooks
│   ├── pages/      # Page components for routing
│   ├── utils/      # Utility functions and helpers (localization, alerts, etc.)
│   ├── validation/ # Validation schemas
│   ├── App.jsx     # Main application component
│   ├── main.jsx    # Entry point for the application
│   └── index.css   # Global styles
├── .gitignore      # Git ignore file
├── package.json    # Project dependencies and scripts
└── vite.config.js  # Vite configuration
```

## Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/TuulilasiPojat.git
   cd TuulilasiPojat
   ```

2. Install dependencies for the frontend:

   ```bash
   cd client
   npm install
   ```

## Running Frontend

To run the frontend locally for development, use:

```bash
npm run dev
```

This will start the Vite development server, default URL is `http://localhost:5173`.

## Features

### Bookings

- View, create, update, and delete bookings.
- Filter bookings by date, status, or other criteria.
- Admins can manage all bookings, while regular users can manage their own.

### Notes

- Create, edit, and delete personal notes.
- Notes are sorted by date and displayed in a user-friendly interface.

### Users

- Admins can manage users, including creating, updating, and deleting accounts.
- Regular users can update their profile information.

### Authentication

- Users can login and logout from their accounts.
- Users can restore their password by receiving an email to the email address that is set in their account.

### Orders

- View, create, update, and delete orders.
- Filter orders by completion status.
- Manage order details, including products and client information.

### Locations

- Admins can manage locations, including creating, updating, and deleting them.
- Regular users can view their assigned locations.

### Internationalization

- Supports multiple languages using `i18next`.
- Easily switch between languages in the application.

### Notifications

- Snackbar notifications for success, error, and informational messages using `Notistack`.

## Deployment

To build the frontend for production, run:

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

## Proxy Configuration

The frontend is configured to proxy API requests to the backend. This is set up in the `vite.config.js` file:

```js
server: {
  proxy: {
    "/api": "http://localhost:3000",
  },
},
```

Ensure the backend is running at the specified URL.

## Additional Notes

- The frontend communicates with the backend API for data operations.
- Ensure the backend is set up and running before using the frontend.

For more details, refer to the [Backend README](../server/README.md).
