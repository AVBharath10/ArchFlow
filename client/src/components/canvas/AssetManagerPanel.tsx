
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Plus, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Asset {
    id: string;
    name: string;
    url: string;
    type: 'image';
}

interface AssetManagerPanelProps {
    onAddAssetNode: (url: string, name: string) => void;
    onClose: () => void;
}

export function AssetManagerPanel({ onAddAssetNode, onClose }: AssetManagerPanelProps) {
    // Using local state for now. In real app, this should be persisted.
    const [assets, setAssets] = useState<Asset[]>([
        { id: '1', name: 'Server', url: 'https://cdn-icons-png.flaticon.com/512/2965/2965278.png', type: 'image' },
        { id: '2', name: 'Database', url: 'https://cdn-icons-png.flaticon.com/512/2906/2906274.png', type: 'image' },
        { id: '3', name: 'User', url: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png', type: 'image' },
        { id: '4', name: 'Cloud', url: 'https://cdn-icons-png.flaticon.com/512/4138/4138124.png', type: 'image' }
    ]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target?.result as string;
                setAssets([...assets, {
                    id: Date.now().toString(),
                    name: file.name,
                    url,
                    type: 'image'
                }]);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-[300px] border-l border-border bg-card flex flex-col h-full shadow-xl z-30 absolute right-0 top-0 bottom-0 animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm flex justify-between items-center">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Asset Library</h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="p-4 border-b border-border bg-muted/10">
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="w-full justify-center gap-2 relative border-dashed hover:border-primary">
                        <Upload className="w-4 h-4" />
                        Upload Image
                        <Input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                        />
                    </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    Upload custom icons or images (stored locally)
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 grid grid-cols-2 gap-3">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="group relative flex flex-col items-center gap-2 p-3 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                            onClick={() => onAddAssetNode(asset.url, asset.name)}
                        >
                            <div className="w-12 h-12 flex items-center justify-center">
                                <img src={asset.url} alt={asset.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <span className="text-[10px] text-muted-foreground truncate w-full text-center font-medium">
                                {asset.name}
                            </span>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAssets(assets.filter(a => a.id !== asset.id));
                                }}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
