import { useCallback, useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useRoute } from "wouter";
import { useProject, useUpdateProject } from "@/hooks/use-projects";
import { useDebouncedCallback } from 'use-debounce';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Save,
  Server,
  Globe,
  Database,
  Share2,
  Download,
  Loader2,
  Box,
  Layers,
  LogOut,
  Image as ImageIcon,
  StickyNote
} from "lucide-react";
import { nodeTypes, ServiceNode, EndpointNode, ModelNode, ImageNode, StickyNoteNode } from "@/components/canvas/CustomNodes";
import { AssetManagerPanel } from '@/components/canvas/AssetManagerPanel';
import { InspectorPanel } from "@/components/canvas/InspectorPanel";
import { Link } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser, useLogout } from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define node types map
const NODE_TYPES = {
  service: ServiceNode,
  endpoint: EndpointNode,
  model: ModelNode,
  image: ImageNode,
  stickyNote: StickyNoteNode,
};

function CanvasContent({ projectId }: { projectId: number }) {
  const { data: project, isLoading } = useProject(projectId);
  const updateProject = useUpdateProject();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAssets, setShowAssets] = useState(false);

  const { data: user } = useUser();
  const logout = useLogout();

  // Initialize canvas from DB
  useEffect(() => {
    if (project?.canvasState) {
      const state = project.canvasState as any;
      setNodes(state.nodes || []);
      setEdges(state.edges || []);
    }
  }, [project, setNodes, setEdges]);

  // Debounced auto-save
  const debouncedSave = useDebouncedCallback((newNodes, newEdges) => {
    if (!project) return;
    setIsSaving(true);
    updateProject.mutate(
      {
        id: projectId,
        canvasState: { nodes: newNodes, edges: newEdges }
      },
      {
        onSettled: () => setIsSaving(false)
      }
    );
  }, 1000);

  // Handle changes
  const handleNodesChange = useCallback((changes: any) => {
    onNodesChange(changes);
    // We need current nodes for save, but onNodesChange updates state asynchronously
    // In a real app we'd wait for state update or use getNodes() from instance
  }, [onNodesChange]);

  // Trigger save on nodes/edges change effect
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      debouncedSave(nodes, edges);
    }
  }, [nodes, edges, debouncedSave]);

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = (type: 'service' | 'endpoint' | 'model' | 'stickyNote') => {
    const id = `${type}-${Date.now()}`;
    const newNode: Node = {
      id,
      type,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100
      },
      data: type === 'service'
        ? { label: 'New Service', description: '' }
        : type === 'endpoint'
          ? { label: 'New Endpoint', method: 'GET', path: '/api/resource' }
          : type === 'stickyNote'
            ? { text: 'New Note' }
            : { label: 'New Model', fields: 'id: string' }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const updateNodeData = (id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const updated = { ...node, data: { ...node.data, ...data } };
          if (selectedNode?.id === id) setSelectedNode(updated); // Update inspector live
          return updated;
        }
        return node;
      })
    );
  };

  const addAssetNode = (url: string, name: string) => {
    const id = `image-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'image',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100
      },
      data: { label: name, url }
    };
    setNodes((nds) => [...nds, newNode]);
    setShowAssets(false);
  };

  const deleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setSelectedNode(null);
  };

  if (isLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading canvas...</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      {/* Navbar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{project?.name}</span>
              <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal text-muted-foreground border-border bg-secondary/50">
                v1.0.0
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {isSaving ? 'Saving...' : 'Saved locally'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 text-xs"
            onClick={() => {
              setIsSaving(true);
              updateProject.mutate(
                {
                  id: projectId,
                  canvasState: { nodes, edges }
                },
                {
                  onSettled: () => setIsSaving(false)
                }
              );
            }}
            disabled={isSaving}
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
            <Share2 className="w-3.5 h-3.5" /> Share
          </Button>
          <Button variant="default" size="sm" className="h-8 gap-2 text-xs bg-primary hover:bg-primary/90 mr-2">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>

          {user && (
            <Avatar className="h-8 w-8 ml-2">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Toolbox (Absolute overlay) */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 p-2 bg-card/90 backdrop-blur border border-border rounded-lg shadow-xl w-14 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addNode('service')}
                className="hover:bg-primary/20 hover:text-primary"
              >
                <Server className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Service</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addNode('endpoint')}
                className="hover:bg-primary/20 hover:text-primary"
              >
                <Globe className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Endpoint</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addNode('model')}
                className="hover:bg-primary/20 hover:text-primary"
              >
                <Database className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Model</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addNode('stickyNote')}
                className="hover:bg-primary/20 hover:text-primary"
              >
                <StickyNote className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add Sticky Note</TooltipContent>
          </Tooltip>

          <div className="w-8 h-[1px] bg-border my-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Layers className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Layers</TooltipContent>
          </Tooltip>

          <div className="w-8 h-[1px] bg-border my-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showAssets ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setShowAssets(!showAssets)}
                className={showAssets ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Assets</TooltipContent>
          </Tooltip>
        </div>

        {/* Canvas */}
        <div className="flex-1 h-full bg-secondary/5 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={NODE_TYPES}
            fitView
            minZoom={0.2}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="hsl(var(--muted-foreground))" gap={16} size={1} className="opacity-10" />
            <Controls className="bg-card border-border shadow-lg" />
            <MiniMap
              className="bg-card border-border shadow-lg"
              maskColor="rgba(0,0,0,0.6)"
              nodeColor={(n) => {
                if (n.type === 'service') return 'hsl(var(--primary))';
                if (n.type === 'endpoint') return '#10b981';
                return '#8b5cf6';
              }}
            />
            <Panel position="bottom-center" className="bg-card/80 backdrop-blur px-4 py-2 rounded-full border border-border text-xs text-muted-foreground shadow-lg mb-8">
              {nodes.length} nodes • {edges.length} connections
            </Panel>
          </ReactFlow>
        </div>

        {/* Inspector Sidebar */}
        <InspectorPanel
          selectedNode={selectedNode}
          onUpdateNode={updateNodeData}
          onDeleteNode={deleteNode}
        />

        {/* Asset Manager Panel */}
        {showAssets && (
          <AssetManagerPanel
            onAddAssetNode={addAssetNode}
            onClose={() => setShowAssets(false)}
          />
        )}
      </div>
    </div>
  );
}

export default function ProjectCanvas() {
  const [match, params] = useRoute("/projects/:id");
  const id = params?.id ? parseInt(params.id) : null;

  if (!match || !id) return <div>Invalid Project</div>;

  return (
    <ReactFlowProvider>
      <CanvasContent projectId={id} />
    </ReactFlowProvider>
  );
}
