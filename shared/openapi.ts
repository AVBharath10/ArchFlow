
import { CanvasState } from "./schema";

export function generateOpenAPI(state: CanvasState) {
  const openapi: any = {
    openapi: "3.0.0",
    info: {
      title: "Generated API",
      version: "1.0.0",
    },
    paths: {},
    components: {
      schemas: {},
    },
  };

  // Process Endpoints
  const endpointNodes = state.nodes.filter((n) => n.type === "endpoint");
  endpointNodes.forEach((node) => {
    const data = node.data as any; // Cast to access specific fields
    if (data.path && data.method) {
      if (!openapi.paths[data.path]) {
        openapi.paths[data.path] = {};
      }
      openapi.paths[data.path][data.method.toLowerCase()] = {
        summary: data.summary || node.label || "No summary",
        responses: {
          "200": {
            description: "OK",
          },
        },
      };
    }
  });

  // Process Models
  const modelNodes = state.nodes.filter((n) => n.type === "model");
  modelNodes.forEach((node) => {
    const data = node.data as any;
    const modelName = node.label || "UnnamedModel";
    
    const properties: Record<string, any> = {};
    if (data.fields) {
      data.fields.split(',').forEach((field: string) => {
        const [name, type] = field.split(':').map((s) => s.trim());
        if (name) {
          properties[name] = { type: type || "string" };
        }
      });
    }

    openapi.components.schemas[modelName] = {
      type: "object",
      properties,
    };
  });

  return openapi;
}
