# Contributing to ArchFlow

Thank you for your interest in contributing to ArchFlow! We are building a powerful visual tool for backend architecture design.

## Project Structure

- `client/`: Frontend React application (Vite, TailwindDB, React Flow).
- `server/`: Backend Node.js application (Express, Drizzle ORM).
- `shared/`: Shared types and schemas (Zod, Drizzle).

## Development Workflow

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Database**:
    The project uses PostgreSQL with Drizzle ORM.
    -   `npm run db:push`: Push schema changes to the database.
    -   `npm run db:studio`: Open Drizzle Studio to view data.

## Adding New Node Types

1.  **Update Schema**:
    Modify `shared/schema.ts` to define the new node type and its data interface.

2.  **Update Rendering**:
    Create or update a component in `client/src/components/canvas/CustomNodes.tsx` to render the new node.

3.  **Update Inspector**:
    Modify `client/src/components/canvas/InspectorPanel.tsx` to add form fields for editing the new node's properties.

## Styling

We use TailwindCSS and Shadcn UI. Please stick to the existing design system and ensure dark mode support.

## License

MIT
