import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Node } from 'reactflow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface InspectorPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (id: string, data: any) => void;
  onDeleteNode: (id: string) => void;
}

export function InspectorPanel({ selectedNode, onUpdateNode, onDeleteNode }: InspectorPanelProps) {
  const { register, control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      label: '',
      description: '',
      method: 'GET',
      path: '',
      summary: '',
      fields: [],
      metadata: {},
      text: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields"
  });

  // Watch metadata for custom rendering/handling since it is a Record<string, string>
  const metadata = watch('metadata') || {};

  useEffect(() => {
    if (selectedNode) {
      // Ensure fields is an array for model nodes, even if empty
      const data = { ...selectedNode.data };
      if (selectedNode.type === 'model' && !Array.isArray(data.fields)) {
        data.fields = [];
      }
      reset(data);
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

  const handleBlur = handleSubmit(onSubmit);

  const addMetadata = () => {
    const key = prompt("Enter metadata key:");
    if (key) {
      const value = prompt("Enter metadata value:");
      if (value) {
        setValue(`metadata.${key}`, value, { shouldDirty: true });
        handleSubmit(onSubmit)();
      }
    }
  };

  const removeMetadata = (key: string) => {
    const newMetadata = { ...metadata };
    delete newMetadata[key];
    setValue('metadata', newMetadata, { shouldDirty: true });
    handleSubmit(onSubmit)();
  };

  return (
    <div className="w-[320px] border-l border-border bg-card flex flex-col h-full shadow-xl z-20">
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Properties</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <form onBlur={handleBlur} className="space-y-4">
            {/* Common Fields */}
            {selectedNode.type !== 'endpoint' && selectedNode.type !== 'stickyNote' && (
              <div className="space-y-2">
                <Label>Label</Label>
                <Input {...register('label')} placeholder="Node Name" />
              </div>
            )}

            {/* Service Specific */}
            {selectedNode.type === 'service' && (
              <>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    {...register('description')}
                    placeholder="What does this service do?"
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Metadata</Label>
                    <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={addMetadata}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 bg-muted/50 p-2 rounded text-xs group">
                        <span className="font-semibold">{key}:</span>
                        <span className="flex-1 truncate">{value as string}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeMetadata(key)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    {Object.keys(metadata).length === 0 && (
                      <div className="text-xs text-muted-foreground italic">No metadata keys</div>
                    )}
                  </div>
                </div>
              </>
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
                <div className="flex items-center justify-between mb-2">
                  <Label>Schema Fields</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ name: 'new_field', type: 'String', required: false })} className="h-7 text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="relative bg-muted/30 p-2 rounded border border-border/50">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-5 w-5 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-[1fr_80px] gap-2">
                          <Input
                            {...register(`fields.${index}.name`)}
                            placeholder="Field Name"
                            className="h-7 text-xs"
                          />
                          <Input
                            {...register(`fields.${index}.type`)}
                            placeholder="Type"
                            className="h-7 text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`required-${index}`}
                            onCheckedChange={(checked) => {
                              setValue(`fields.${index}.required`, checked === true);
                              handleSubmit(onSubmit)();
                            }}
                            defaultChecked={field.required}
                          />
                          <Label htmlFor={`required-${index}`} className="text-xs font-normal cursor-pointer">Required Field</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded">
                      No fields defined.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sticky Note Specific */}
            {selectedNode.type === 'stickyNote' && (
              <div className="space-y-2">
                <Label>Note Text</Label>
                <Textarea
                  {...register('text')}
                  placeholder="Enter note content..."
                  className="min-h-[150px] resize-none"
                />
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
