# Bharath Bazaar

E-commerce application with admin dashboard, user roles, cart, wishlist, and producer features.

## Project structure

```
BharathBazaar/
├── frontend/                 # Frontend assets and views
│   ├── views/                # EJS templates
│   └── public/               # Static files
│       ├── css/
│       ├── js/
│       └── images/
├── backend/                  # Node.js backend
│   ├── config/               # Configuration (e.g. database)
│   ├── controllers/          # Request handlers
│   ├── data/                 # Seed/static data
│   ├── jobs/                 # Cron and background jobs
│   ├── models/               # Mongoose models
│   ├── routes/               # Express route definitions
│   ├── utils/                # Helpers
│   ├── app.js                # Express app setup
│   └── server.js             # Entry point (DB connect, listen)
├── package.json
└── README.md
```

## Setup

1. Install dependencies: `npm install`
2. Ensure MongoDB is reachable (or set `MONGODB_URI`).
3. Start the server: `npm start` (uses nodemon) or `npm run start:server`.

The app runs on port **9002** by default (`PORT` env overrides).

## Scripts

- `npm start` – run with nodemon (auto-reload)
- `npm run start:server` – run with node
- `npm test` – placeholder test script
