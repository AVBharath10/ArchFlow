import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Box, Server, Globe, Database, ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { clsx } from 'clsx';
import { CanvasNode } from '@shared/schema';

// Helper to get method color
const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'POST': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'PUT': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'DELETE': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'PATCH': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

export const ServiceNode = memo(({ data, selected }: NodeProps<CanvasNode['data']>) => {
  return (
    <div className={clsx(
      "w-[240px] bg-card border rounded-lg shadow-sm transition-all duration-200",
      selected ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-border"
    )}>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2 bg-muted/30 rounded-t-lg">
        <Server className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">Service</span>
      </div>
      <div className="p-4">
        <div className="font-medium mb-1">{(data as any).label || 'Unnamed Service'}</div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {(data as any).description || 'No description provided.'}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  );
});

export const EndpointNode = memo(({ data, selected }: NodeProps<CanvasNode['data']>) => {
  const endpointData = data as any;
  const methodClass = getMethodColor(endpointData.method);

  return (
    <div className={clsx(
      "w-[280px] bg-card border rounded-lg shadow-sm transition-all duration-200",
      selected ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-border"
    )}>
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground" />
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={clsx("font-mono font-bold border", methodClass)}>
            {endpointData.method}
          </Badge>
          <code className="text-xs flex-1 truncate bg-muted/50 px-1.5 py-0.5 rounded">
            {endpointData.path}
          </code>
        </div>
        <div className="text-xs text-muted-foreground">
          {endpointData.summary || 'No summary'}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground" />
    </div>
  );
});

export const ModelNode = memo(({ data, selected }: NodeProps<CanvasNode['data']>) => {
  return (
    <div className={clsx(
      "w-[200px] bg-card border rounded-lg shadow-sm transition-all duration-200",
      selected ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-border"
    )}>
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground" />
      <div className="px-3 py-2 border-b border-border/50 flex items-center gap-2 bg-muted/30 rounded-t-lg">
        <Database className="w-3.5 h-3.5 text-violet-400" />
        <span className="font-mono text-xs font-medium">Model</span>
      </div>
      <div className="p-3">
        <div className="font-medium text-sm mb-2">{(data as any).label}</div>
        <div className="space-y-1">
          {((data as any).fields || '').split(',').map((field: string, i: number) => (
            <div key={i} className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-border" />
              {field.trim()}
            </div>
          ))}
          {!(data as any).fields && <span className="text-xs text-muted-foreground italic">No fields</span>}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-muted-foreground" />
    </div>
  );
});

export const nodeTypes = {
  service: ServiceNode,
  endpoint: EndpointNode,
  model: ModelNode,
};
