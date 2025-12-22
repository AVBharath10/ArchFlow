## Packages
reactflow | The library for the interactive node-based canvas
framer-motion | For smooth animations and page transitions

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["Inter", "sans-serif"],
  mono: ["JetBrains Mono", "monospace"],
}

API Integration:
- Canvas state (nodes/edges) is stored as a JSON blob in the 'projects' table
- Auto-save logic should debounce updates to PUT /api/projects/:id
