# Asset Manager

## Project Setup

This project uses Node.js, Express, Vite, and Drizzle ORM with PostgreSQL.

### Prerequisites

1.  **Node.js**: Install from [nodejs.org](https://nodejs.org/).
2.  **PostgreSQL**: Install locally or use a cloud provider.

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Setup environment variables:
    *   Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Update `DATABASE_URL` in `.env` with your PostgreSQL connection string.

### Database Setup

1.  Push the schema to the database:
    ```bash
    npm run db:push
    ```

### Running the Application

1.  Start the development server:
    ```bash
    npm run dev
    ```

2.  Open your browser at `http://localhost:5000`.

## Scripts

*   `npm run dev`: Start development server (backend + frontend).
*   `npm run build`: Build for production.
*   `npm start`: Start production server.
*   `npm run db:push`: Push Drizzle schema changes to the database.
