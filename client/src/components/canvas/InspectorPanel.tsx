import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Node } from 'reactflow';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';

interface InspectorPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (id: string, data: any) => void;
  onDeleteNode: (id: string) => void;
}

export function InspectorPanel({ selectedNode, onUpdateNode, onDeleteNode }: InspectorPanelProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  
  useEffect(() => {
    if (selectedNode) {
      reset(selectedNode.data);
    }
  }, [selectedNode, reset]);

  if (!selectedNode) {
    return (
      <div className="w-[300px] border-l border-border bg-card/50 p-6 flex flex-col items-center justify-center text-center h-full">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-1">Inspector</h3>
        <p className="text-sm text-muted-foreground">Select a node to edit its properties.</p>
      </div>
    );
  }

  const onSubmit = (data: any) => {
    onUpdateNode(selectedNode.id, data);
  };

  // Watch for live updates if desired, or just use onBlur/onSubmit
  // For now, let's trigger updates on form submit or blur inputs
  
  const handleBlur = handleSubmit(onSubmit);

  return (
    <div className="w-[320px] border-l border-border bg-card flex flex-col h-full shadow-xl z-10">
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Properties</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <form onBlur={handleBlur} className="space-y-4">
            {/* Common Fields */}
            {selectedNode.type !== 'endpoint' && (
              <div className="space-y-2">
                <Label>Label</Label>
                <Input {...register('label')} placeholder="Node Name" />
              </div>
            )}

            {/* Service Specific */}
            {selectedNode.type === 'service' && (
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  {...register('description')} 
                  placeholder="What does this service do?" 
                  className="min-h-[100px] resize-none"
                />
              </div>
            )}

            {/* Endpoint Specific */}
            {selectedNode.type === 'endpoint' && (
              <>
                <div className="space-y-2">
                  <Label>HTTP Method</Label>
                  <Select 
                    onValueChange={(val) => {
                      setValue('method', val);
                      handleSubmit(onSubmit)();
                    }} 
                    defaultValue={selectedNode.data.method}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Path</Label>
                  <Input {...register('path')} placeholder="/api/users" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <Input {...register('summary')} placeholder="Get user details" />
                </div>
              </>
            )}

            {/* Model Specific */}
            {selectedNode.type === 'model' && (
              <div className="space-y-2">
                <Label>Schema Definition</Label>
                <Textarea 
                  {...register('fields')} 
                  placeholder="id: string, created_at: date" 
                  className="font-mono text-xs min-h-[150px]"
                />
                <p className="text-[10px] text-muted-foreground">Comma separated fields.</p>
              </div>
            )}
          </form>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-muted/10">
        <Button 
          variant="destructive" 
          className="w-full gap-2" 
          onClick={() => onDeleteNode(selectedNode.id)}
        >
          <Trash2 className="w-4 h-4" /> Delete Node
        </Button>
      </div>
    </div>
  );
}
